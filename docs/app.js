/* SystronIA Product Studio · simulador genérico, sin backend. */
(() => {
  'use strict';
  const config = window.PRODUCT_STUDIO_MODEL;
  if (!config || config.schemaVersion !== 1 || !Array.isArray(config.scenarios)) {
    document.body.textContent = 'Falta el modelo de la demostración.'; return;
  }
  const $ = (id) => document.getElementById(id);
  const key = `systronia-demo:${config.product.name}:v${config.schemaVersion}`;
  const viewDefinitions = [
    { id: 'work', title: 'Mi trabajo', symbol: '▦' },
    { id: 'case', title: 'Expediente', symbol: '▤' },
    { id: 'journey', title: 'Recorrido', symbol: '↝' },
    { id: 'review', title: 'Validación', symbol: '✓' }
  ];
  const findScenario = (id) => config.scenarios.find(s => s.id === id) || config.scenarios[0];
  const findRole = (id) => config.roles.find(r => r.id === id);
  const defaultRole = () => config.roles[0]?.id || '';
  function freshScenario(s) {
    return {
      scenario: s.id, currentRole: s.personas[0] || defaultRole(), view: 'work',
      case: JSON.parse(JSON.stringify(s.initialCase)),
      history: [{ action: 'INICIO', by: 'SISTEMA', note: `Escenario ${s.id} iniciado con datos ficticios`, index: 0 }],
      review: { verdict: 'pending', comments: '', requirements: [], uxChoices: {} }
    };
  }
  function fresh() { return { schemaVersion: 1, active: config.scenarios[0].id, records: Object.fromEntries(config.scenarios.map(s => [s.id, freshScenario(s)])) }; }
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(key));
      if (d?.schemaVersion !== 1 || !d.records || !findScenario(d.active)) return fresh();
      if (!config.scenarios.every(s => d.records[s.id] && s.stages.some(x => x.id === d.records[s.id].case?.stage))) return fresh();
      return d;
    } catch { return fresh(); }
  }
  let store = load();
  let current = () => store.records[store.active];
  let scenario = () => findScenario(store.active);
  let caseState = () => current().case;
  let stage = () => scenario().stages.find(s => s.id === caseState().stage);
  const toSave = () => localStorage.setItem(key, JSON.stringify(store));
  const clean = (s) => String(s ?? '').replace(/[<>]/g, '');
  const h = (tag, opts={}, children=[]) => {
    const node = document.createElement(tag);
    if (opts.className) node.className=opts.className;
    if (opts.text != null) node.textContent=String(opts.text);
    if (opts.id) node.id=opts.id;
    for (const [k,v] of Object.entries(opts.attrs || {})) node.setAttribute(k,v);
    for (const c of children) node.append(c);
    return node;
  };
  function showToast(message){const el=$('toast'); el.textContent=message;el.hidden=false;clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>el.hidden=true,2800);}
  function confirmAction(title,description,fn,fields=[]) {
    const d=$('dialog'), yes=$('dialogConfirm'), no=$('dialogCancel'), previous=document.activeElement;
    const form=$('dialogFields');form.replaceChildren();
    $('dialogTitle').textContent=title; $('dialogText').textContent=description;
    const controls=[];
    for(const field of fields){
      const wrap=h('label',{className:'demo-field'});
      wrap.append(h('span',{text:field.label+(field.required?' *':'')}));
      let control;
      if(field.type==='textarea'){control=h('textarea',{attrs:{rows:'3'}});}
      else if(field.type==='select'){
        control=h('select');
        for(const option of field.options||[])control.append(h('option',{text:typeof option==='string'?option:option.label,attrs:{value:typeof option==='string'?option:option.value}}));
      } else {control=h('input',{attrs:{type:field.type==='number'?'number':'text'}});}
      control.name=field.id;
      if(field.required)control.required=true;
      if(field.min!==undefined)control.min=field.min;
      if(field.max!==undefined)control.max=field.max;
      if(field.minLength!==undefined)control.minLength=field.minLength;
      if(field.maxLength!==undefined)control.maxLength=field.maxLength;
      if(field.placeholder)control.placeholder=field.placeholder;
      if(field.default!==undefined)control.value=String(field.default);
      wrap.append(control);form.append(wrap);controls.push({field,control});
    }
    d.hidden=false; (controls[0]?.control||yes).focus();
    const close=()=>{d.hidden=true;yes.onclick=null;no.onclick=null;document.removeEventListener('keydown',handleEscape);form.replaceChildren();if(previous?.focus)previous.focus();};
    const handleEscape=(e)=>{if(e.key==='Escape')close();};
    document.addEventListener('keydown',handleEscape);no.onclick=close;
    yes.onclick=()=>{
      const payload={};
      for(const {field,control} of controls){
        if(!control.checkValidity()){control.reportValidity();control.focus();return;}
        payload[field.id]=field.type==='number'?(control.value===''?null:Number(control.value)):control.value.trim();
      }
      close();fn(payload);
    };
  }
  function button(label, cb, type='primary') {const el=h('button',{className:`btn btn-${type}`,text:label,attrs:{type:'button'}});el.onclick=cb;return el;}
  function labelText(s, id) {return s.stages.find(x=>x.id===id)?.label || id;}
  function guardFailure(a,values){
    for(const g of a.guards||[]){
      const v=values[g.field];
      const ok=g.op==='truthy'?Boolean(v):g.op==='falsy'?!v:g.op==='eq'?v===g.value:g.op==='neq'?v!==g.value:g.op==='gte'?Number(v)>=Number(g.value):g.op==='lte'?Number(v)<=Number(g.value):false;
      if(!ok)return g.message;
    }
    return null;
  }
  function applyAction(a,inputs={}) {
    const s=scenario(),rec=current();
    if(a.by!==rec.currentRole||a.from!==rec.case.stage){showToast('Acción no disponible en este rol y estado.');return;}
    const blocked=guardFailure(a,rec.case.values);
    if(blocked){showToast(blocked);return;}
    const next=s.stages.find(x=>x.id===a.to);
    if(!next){showToast('Configuración inválida: estado de destino inexistente.');return;}
    for(const field of a.inputs||[]){
      const val=inputs[field.id];
      if(field.required && (val===undefined||val===null||val==='')){showToast(`Falta: ${field.label}`);return;}
      if(field.type==='number' && val!==null && !Number.isFinite(val)){showToast(`Dato numérico inválido: ${field.label}`);return;}
    }
    rec.case.stage=a.to;
    Object.assign(rec.case.values,a.effect||{},inputs);
    const extra=typeof inputs.correctionReason==='string'&&inputs.correctionReason?` · Motivo: ${inputs.correctionReason}`:typeof inputs.price==='number'?` · Precio: ${new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(inputs.price)}`:'';
    rec.history.unshift({action:a.id,by:a.by,note:(a.note||a.label)+extra,index:rec.history.length});
    toSave();render();showToast(`Ahora: ${next.label}`);
  }
  function renderMenu() {
    const root=$('views');root.replaceChildren();
    for (const item of viewDefinitions) {
      const btn = button(`${item.symbol}  ${item.title}`,()=>{current().view=item.id;toSave();render();},'side');
      btn.classList.toggle('active',current().view===item.id);
      if (current().view===item.id) btn.setAttribute('aria-current','page');
      root.append(btn);
    }
    const scenarioSelect=$('scenario');scenarioSelect.replaceChildren();
    config.scenarios.forEach(s=>scenarioSelect.append(h('option',{text:s.name,attrs:{value:s.id}})));
    scenarioSelect.value=store.active;
    scenarioSelect.onchange=()=>{store.active=scenarioSelect.value;toSave();render();};
    const roleSelect=$('role');roleSelect.replaceChildren();
    scenario().personas.forEach(id=>roleSelect.append(h('option',{text:findRole(id)?.name||id,attrs:{value:id}})));
    if (!scenario().personas.includes(current().currentRole)) current().currentRole=scenario().personas[0];
    roleSelect.value=current().currentRole;
    roleSelect.onchange=()=>{current().currentRole=roleSelect.value;toSave();render();};
    $('brandName').textContent=config.product.name;
  }
  function screenInfo(){return (config.screens||[]).find(sc=>sc.id===stage()?.screenId);}
  function statusChip() { return h('span',{className:'status-chip',text:stage()?.label||caseState().stage}); }
  function sectionTitle(kicker,title) {return h('div',{className:'section-title'},[h('div',{className:'kicker',text:kicker}),h('h2',{text:title})]);}
  function caseHeader(){const root=h('div',{className:'case-header'});root.append(h('div',{},[h('span',{className:'case-id',text:caseState().id}),h('h3',{text:caseState().title}),h('p',{className:'muted',text:scenario().objective})]),statusChip());return root;}
  function summaryCards() {
    const {customer,equipment}=caseState();const values=caseState().values;
    const cards=[['Expediente',caseState().id],['Cliente / proveedor',customer],['Responsable actual',stage()?.owner?findRole(stage().owner)?.name:'Sin pendientes']];
    return h('div',{className:'stats'},cards.map(([l,v])=>h('div',{className:'stat'},[h('span',{text:l}),h('strong',{text:v||'—'})])));
  }
  function nextActions(){return scenario().actions.filter(a=>a.from===caseState().stage && a.by===current().currentRole);}
  function screenExperience(){
    const id=caseState().stage, v=caseState().values, root=h('section',{className:'screen-experience'});
    const panel=h('div',{className:'panel'});
    const title=(k,t,sub)=>panel.append(sectionTitle(k,t),...(sub?[h('p',{className:'experience-copy',text:sub})]:[]));
    const info=(label,value)=>h('div',{className:'experience-info'},[h('span',{text:label}),h('strong',{text:value})]);
    const field=(label,type,value,help='')=>{const f=h('div',{className:'preview-field'});f.append(h('label',{text:label}),h('div',{className:'preview-input'},[h('span',{text:value}),h('span',{className:'input-type',text:type})]));if(help)f.append(h('small',{text:help}));return f;};
    if(id==='preview'){
      title('VISTA PREVIA · VERSIÓN CANDIDATA','Evaluación de proveedor','Así verá el formulario el Capturista. Esta prueba usa datos ficticios y no crea un registro.');
      const box=h('div',{className:'form-preview'});box.append(h('div',{className:'preview-title'},[h('span',{className:'preview-icon',text:'✓'}),h('div',{},[h('strong',{text:'Evaluación de proveedor'}),h('small',{text:'Calidad · Proveedores · Versión candidata'})])]));
      const fields=h('div',{className:'preview-fields'});fields.append(field('Proveedor *','Lista','Selecciona un proveedor'),field('Fecha de evaluación *','Fecha','dd / mm / aaaa'),field('Evaluador','Usuario','Se asignará al iniciar'),field('Criterios de evaluación','Grupo repetible','Entrega a tiempo · Calidad del lote · Documentación'));box.append(fields);
      const calc=h('div',{className:'calculation-preview'},[h('span',{text:'RESULTADO CALCULADO'}),h('strong',{text:'— puntos'}),h('small',{text:'La clasificación se mostrará al completar la evaluación.'})]);box.append(calc);panel.append(box);
    } else if(id==='published'){
      title('FORMULARIOS DISPONIBLES','Iniciar una evaluación','Solo aparecen los formularios publicados y asignados a tu alcance.');
      const card=h('article',{className:'published-form-card'});card.append(h('div',{className:'published-form-icon',text:'✓'}),h('div',{className:'published-form-copy'},[h('span',{className:'badge-published',text:'DISPONIBLE'}),h('h3',{text:'Evaluación de proveedor'}),h('p',{text:'Revisión periódica de desempeño y cumplimiento de proveedores.'}),h('small',{text:'Versión 1 · Tiempo estimado 8 min · Calidad'})]),h('span',{className:'arrow-go',text:'→'}));panel.append(card,h('div',{className:'info-strip',text:'Al iniciar se creará un registro ligado a la versión publicada. Podrás guardar y continuar después.'}));
    } else if(id==='capture'){
      title('NUEVA EVALUACIÓN · EVP-DEMO-001','Evaluación de proveedor','Completa la evaluación. Los campos indicados con * son necesarios para finalizar.');
      const status=h('div',{className:`save-indicator ${v.saved?'is-saved':'is-pending'}`},[h('span',{text:v.saved?'✓':'●'}),h('strong',{text:v.saved?'Guardado':'Borrador local'}),h('small',{text:v.saved?'Último guardado confirmado':'Los cambios se simulan en esta demo'})]);panel.append(status);
      const form=h('div',{className:'preview-fields capture-fields'});form.append(field('Proveedor *','Lista',v.supplier||'Empaques Horizonte Demo'),field('Fecha de evaluación *','Fecha','22 / 10 / 2026'),field('Evaluador','Usuario','María López · Calidad'));
      const criteria=h('div',{className:'criteria-card'});const addCriterion=h('button',{className:'btn btn-outline',text:'+ Agregar criterio',attrs:{type:'button'}});addCriterion.addEventListener('click',()=>{const row=h('div',{className:'criterion-row'});row.append(h('div',{},[h('strong',{text:'Nuevo criterio'}),h('small',{text:'Peso 1.0 · Evidencia opcional'})]),h('span',{className:'field-chip',text:'Pendiente'}),h('span',{className:'criterion-check',text:'+'}));criteria.append(row);showToast('Criterio agregado a la simulación.');});criteria.append(h('div',{className:'criteria-heading'},[h('div',{},[h('strong',{text:'Criterios de evaluación'}),h('small',{text:'Califica cada criterio del 1 al 5'})]),addCriterion]));
      [['Entrega a tiempo','5 / 5'],['Calidad del lote','4 / 5'],['Documentación','4 / 5']].forEach(([name,score])=>{const row=h('div',{className:'criterion-row'});row.append(h('div',{},[h('strong',{text:name}),h('small',{text:'Peso 1.0 · Evidencia opcional'})]),h('span',{className:'field-chip',text:score}),h('span',{className:'criterion-check',text:'✓'}));criteria.append(row);});form.append(criteria);panel.append(form);
    } else if(id==='draft'){
      title('MIS BORRADORES','Continúa donde te quedaste','Los borradores conservan los datos confirmados y pueden reanudarse sin volver a empezar.');
      const card=h('article',{className:'draft-card'});card.append(h('div',{className:'draft-mark',text:'◷'}),h('div',{className:'draft-main'},[h('strong',{text:'Evaluación de proveedor'}),h('span',{text:'EVP-DEMO-001 · Empaques Horizonte Demo'}),h('div',{className:'progress-track'},[h('span',{className:'progress-fill'})]),h('small',{text:'65% completado · Guardado hoy, 10:42 a. m. · Versión 1'})]),h('span',{className:'draft-status',text:'Borrador'}));panel.append(card);
    } else if(id==='offline'){
      title('CAPTURA SIN CONEXIÓN','Tus cambios siguen aquí','La conexión se interrumpió. Puedes continuar trabajando; estos cambios aún no están confirmados en el servidor.');
      const alert=h('div',{className:'offline-alert'},[h('span',{className:'offline-symbol',text:'!' }),h('div',{},[h('strong',{text:'Sin conexión · 2 cambios pendientes'}),h('p',{text:'La captura local se conserva en este dispositivo. No cierres esta pestaña hasta recuperar la conexión.'})])]);panel.append(alert);
      const pending=h('div',{className:'pending-list'});[['Calidad del lote','Calificación cambiada a 4'],['Observación','Se agregó una nota']].forEach(([a,b])=>pending.append(h('div',{className:'pending-row'},[h('span',{className:'pending-dot'}),h('div',{},[h('strong',{text:a}),h('small',{text:b})]),h('span',{className:'pending-tag',text:'PENDIENTE'})])));panel.append(pending);
    } else if(id==='conflict'){
      title('CAMBIOS SIMULTÁNEOS','Revisa qué versión conservar','Otra sesión modificó este registro. Tus cambios locales siguen intactos hasta que decidas.');
      const compare=h('div',{className:'conflict-compare'});[["TU CAPTURA","Calidad del lote: 4 / 5","Observación: Empaque correcto"],["OTRA SESIÓN","Calidad del lote: 3 / 5","Observación: Revisar lote recibido"]].forEach(([head,a,b])=>{const c=h('article',{className:'conflict-version'});c.append(h('span',{className:'kicker',text:head}),h('strong',{text:a}),h('p',{text:b}),h('small',{text:head==='TU CAPTURA'?'Guardada localmente · 10:44 a. m.':'Actualizada por Ana Ruiz · 10:43 a. m.'}));compare.append(c);});panel.append(compare,h('div',{className:'info-strip',text:'La demo conservará tu captura al elegir “Conservar mi captura”. En el sistema real, la resolución debe quedar auditada.'}));
    } else if(id==='validation_error'){
      title('NO SE PUDO FINALIZAR','Revisa los campos pendientes','No se perdió la captura. Corrige los datos indicados y vuelve a finalizar.');
      const alert=h('div',{className:'validation-alert'},[h('strong',{text:'Falta información obligatoria'}),h('p',{text:'Completa estos datos antes de enviar la evaluación.'})]);panel.append(alert);
      const errors=h('ul',{className:'error-list'});[['Calificación de Documentación','Selecciona una calificación.'],['Motivo de no conformidad','Obligatorio cuando un criterio no cumple.']].forEach(([a,b])=>errors.append(h('li',{},[h('span',{text:'!'}),h('div',{},[h('strong',{text:a}),h('small',{text:b})])])));panel.append(errors,h('div',{className:'info-strip',text:'Tus respuestas previas y el borrador permanecen guardados.'}));
    } else if(id==='finalized'){
      title('EVALUACIÓN FINALIZADA','Resultado de evaluación','El registro quedó asociado a la versión del formulario, autor y fecha de finalización.');
      const score=h('div',{className:'result-hero'},[h('span',{text:'RESULTADO FINAL'}),h('strong',{text:String(v.score??84)}),h('small',{text:'de 100 puntos'}),h('span',{className:'result-classification',text:v.classification||'A PRUEBA'})]);panel.append(score);
      const facts=h('div',{className:'result-facts'});facts.append(info('Folio','EVP-2026-0042'),info('Proveedor','Empaques Horizonte Demo'),info('Versión','1 · Inmutable'),info('Finalizada','22 oct 2026 · 10:46'));panel.append(facts);
    } else if(id==='consulted'){
      title('LECTURA DE SUPERVISIÓN','Historial del registro','Vista de consulta: la evaluación finalizada puede revisarse sin alterar su contenido histórico.');
      const card=h('div',{className:'consulted-card'});card.append(h('span',{className:'consulted-check',text:'✓'}),h('div',{},[h('strong',{text:'Evaluación consultada correctamente'}),h('p',{text:'Folio EVP-2026-0042 · Empaques Horizonte Demo'}),h('small',{text:'Resultado A PRUEBA · 84 puntos · Formulario v1'})]));panel.append(card);
      const timeline=h('ol',{className:'audit-timeline'});[['Formulario publicado','Administrador · 22 oct, 09:15'],['Borrador iniciado','María López · 22 oct, 10:20'],['Evaluación finalizada','María López · 22 oct, 10:46'],['Resultado consultado','Supervisor · ahora']].forEach(([a,b])=>timeline.append(h('li',{},[h('span',{className:'timeline-dot'}),h('div',{},[h('strong',{text:a}),h('small',{text:b})])])));panel.append(timeline);
    } else return null;
    root.append(panel);return root;
  }
  function workView() {
    const root=h('div',{className:'stack'}), role=findRole(current().currentRole);
    if (caseState().stage === 'configuration' && current().currentRole === 'ADMINISTRADOR') return builderView();
    root.append(h('div',{className:'info-banner'},[h('span',{className:'info-symbol',text:'i'}),h('div',{},[h('strong',{text:`Espacio de ${role?.name||current().currentRole}`}),h('p',{text:role?.purpose||''})])]));
    const screen=screenInfo();
    if(screen){
      root.append(h('div',{className:'screen-brief'},[
        h('span',{className:'screen-brief-id',text:`${screen.id} · PROPUESTA DE UX/UI`}),
        h('div',{},[h('strong',{text:screen.title}),h('p',{text:screen.goal})]),
        h('span',{className:'screen-type',text:screen.layout})
      ]));
    }
    root.append(summaryCards());
    const experience=screenExperience();if(experience)root.append(experience);
    const layout=h('div',{className:'columns'}),left=h('section',{className:'panel'}),right=h('section',{className:'panel'});
    left.append(sectionTitle('BANDEJA CONTEXTUAL','Acción pendiente'));
    const available=nextActions();
    if (available.length===0) {
      const d=h('div',{className:'empty'});d.append(h('span',{className:'empty-icon',text:'✓'}),h('strong',{text:'Sin tareas pendientes para este rol'}),h('p',{text:stage()?.owner?`Siguiente responsable: ${findRole(stage().owner)?.name||stage().owner}. Cambia de rol para continuar.`:'Este recorrido terminó. Puedes reiniciarlo o explorar otro escenario.'}));left.append(d);
    } else {
      left.append(h('div',{className:'action-context'},[h('span',{className:'case-id',text:caseState().id}),h('h3',{text:stage().label}),h('p',{text:stage().description})]));
      const buttons=h('div',{className:'action-buttons'});
      for(const a of available){
        const blocked=guardFailure(a,caseState().values);
        const b=button(a.label,()=>confirmAction(a.label,`Se actualizará el expediente ficticio ${caseState().id}. La operación queda visible para los otros roles.`,(inputs)=>applyAction(a,inputs),a.inputs||[]),a.tone==='secondary'?'outline':'primary');
        if(blocked){b.disabled=true;b.title=blocked;b.setAttribute('aria-describedby',`guard-${a.id}`);buttons.append(b,h('span',{className:'guard-notice',text:blocked,id:`guard-${a.id}`}));}
        else buttons.append(b);
      }
      left.append(buttons);
    }
    right.append(sectionTitle('ESTADO COMPARTIDO','Detalles del expediente'),detailFacts(),h('div',{className:'panel-divider'}),h('h3',{className:'minor-heading',text:'Últimos movimientos'}),historyList(3));
    layout.append(left,right);root.append(layout);return root;
  }
  function builderView(){
    const root=h('div',{className:'builder-proposal'});
    root.append(h('div',{className:'builder-banner'},[h('div',{},[h('span',{className:'screen-brief-id',text:'UI-001 · PROPUESTA VISUAL'}),h('h2',{text:'Crear formulario'}),h('p',{text:'Empieza con el formato que necesitas. La estructura avanzada aparece cuando la necesites.'})]),button('Vista previa',()=>{current().view='case';toSave();render();},'outline')]));
    let fieldList;
    const fieldCatalog=[
      {category:'Texto y valores',items:[['Texto corto','Respuesta breve'],['Texto largo','Párrafo o descripción'],['Número','Valor entero'],['Decimal','Valor con decimales'],['Moneda','Importe con divisa'],['Porcentaje','Valor porcentual']]},
      {category:'Contacto y fecha',items:[['Fecha','Día, mes y año'],['Fecha y hora','Fecha con horario'],['Hora','Hora del día'],['Correo','Dirección de email'],['Teléfono','Número telefónico'],['URL','Enlace web']]},
      {category:'Selección y relación',items:[['Sí / No','Respuesta afirmativa o negativa'],['Selección simple','Elegir una opción'],['Selección múltiple','Elegir varias opciones'],['Opciones','Lista de valores configurables'],['Checkbox','Casilla de verificación'],['Usuario','Persona del sistema'],['Relación','Vínculo con otro registro']]},
      {category:'Estructura y contenido',items:[['Archivo','Adjuntar un documento'],['Imagen','Adjuntar una imagen'],['Encabezado','Título visual'],['Sección','Agrupar campos'],['Texto informativo','Instrucciones sin respuesta'],['Grupo compuesto','Agrupar datos relacionados'],['Grupo repetible','Agregar varias filas'],['Tabla estructurada','Conjunto de datos en filas y columnas']]},
      {category:'Cálculos',items:[['Campo calculado','Resultado derivado de otros campos']]}
    ];
    const addDemoField=(type='Texto corto',description='Respuesta breve')=>{const item=h('article',{className:'builder-field'});item.append(h('span',{className:'drag-handle',text:'⠿','attrs':{'aria-hidden':'true'}}),h('div',{className:'builder-field-main'},[h('strong',{text:`Nuevo ${type.toLowerCase()}`}),h('small',{text:type})]),h('span',{className:'field-chip',text:description}),button('⋯',()=>showToast(`Propiedades de ${type} (demostración)`),'outline'));fieldList.append(item);showToast(`${type} agregado al borrador ficticio.`);};
    const bar=h('div',{className:'builder-toolbar'});bar.append(h('span',{className:'save-state',text:'● Borrador guardado'}),h('span',{text:'Evaluación de proveedor · Sin publicar'}));
    bar.append(button('+ Agregar campo',addDemoField,'primary'));root.append(bar);
    const grid=h('div',{className:'builder-grid'}),palette=h('aside',{className:'builder-palette'}),canvas=h('section',{className:'builder-canvas'}),props=h('aside',{className:'builder-properties'});
    palette.append(h('span',{className:'kicker',text:'CATÁLOGO DOCUMENTADO'}),h('h3',{text:'Tipos de campo'}),h('p',{className:'property-copy',text:'Selecciona uno para añadirlo al borrador.'}));
    fieldCatalog.forEach(group=>{const section=h('section',{className:'palette-group'});section.append(h('h4',{text:group.category}));group.items.forEach(([name,description])=>section.append(button(`＋  ${name}`,()=>addDemoField(name,description),'palette-item')));palette.append(section);});
    palette.append(h('div',{className:'property-hint',text:'Catálogo funcional mínimo de la especificación V1.1. La demo no implementa todavía las reglas ni almacenamiento productivo de cada tipo.'}));
    canvas.append(h('div',{className:'builder-section-head'},[h('div',{},[h('span',{className:'kicker',text:'FORMULARIO'}),h('h3',{text:'Evaluación de proveedor'}),h('p',{text:'Versión en borrador · Configuración privada'})]),h('span',{className:'status-chip light-chip',text:'Borrador'})]));
    const fields=[['Proveedor','Lista de proveedores','Selecciona una opción'],['Fecha de evaluación','Fecha','dd/mm/aaaa'],['Evaluador','Usuario','Se asigna al iniciar'],['Criterios de evaluación','Grupo repetible','Entrega · Calidad · Documentación']];
    fieldList=h('div',{className:'builder-field-list'});fields.forEach((f)=>{const item=h('article',{className:'builder-field'});item.append(h('span',{className:'drag-handle',text:'⠿','attrs':{'aria-hidden':'true'}}),h('div',{className:'builder-field-main'},[h('strong',{text:f[0]}),h('small',{text:f[1]})]),h('span',{className:'field-chip',text:f[2]}),button('⋯',()=>showToast(`Opciones de ${f[0]} (demostración)`),'outline'));fieldList.append(item);});const addRow=h('button',{className:'add-field-row',text:'+ Agregar campo o sección',attrs:{type:'button'}});addRow.addEventListener('click',addDemoField);canvas.append(fieldList,addRow);
    props.append(h('span',{className:'kicker',text:'PANEL DE PROPIEDADES'}),h('h3',{text:'Criterios de evaluación'}),h('p',{className:'property-copy',text:'Grupo repetible · Se agrega una fila por criterio.'}),h('label',{className:'demo-field'},[document.createTextNode('Instrucción'),h('textarea',{attrs:{rows:'3'},text:'Evalúa cada criterio y agrega evidencia cuando sea necesario.'})]),h('label',{className:'toggle-row'},[h('input',{attrs:{type:'checkbox',checked:true}}),document.createTextNode('Permitir agregar filas')]),h('div',{className:'property-hint',text:'Puedes reordenar con el asa o usar teclado para mover campos.'}));grid.append(palette,canvas,props);root.append(grid);
    const footer=h('div',{className:'builder-footer'},[h('span',{text:'Cambios guardados en este navegador · Demo ficticia'}),button('Publicar formulario',()=>confirmAction('Publicar formulario','Esta demo solo simula la publicación. No crea datos productivos.',()=>{caseState().values.fieldsReady=true;applyAction({id:'builder-preview',label:'Continuar a vista previa',to:'preview',by:'ADMINISTRADOR',from:'configuration'},{});},[]),'primary')]);root.append(footer);return root;
  }
  function detailFacts() {
    const c=caseState(),v=c.values;
    const rows=[['Asunto',c.title],['Cliente/proveedor',c.customer],['Equipo/referencia',c.equipment],['Etapa',stage()?.label],['Custodia',v.stored === undefined?'No aplica':v.stored?'En resguardo':'Fuera de almacén'],['Importe',v.price === null ?'Por determinar':v.price?new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(v.price): v.amount?new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(v.amount): 'No aplica'],['Documento',v.document||'Sin documento'],['Aprobada',v.approved===undefined?'No aplica':v.approved?'Sí':'No'],['Egreso registrado',v.paid===undefined?'No aplica':v.paid?'Sí':'No']];
    const dl=h('dl',{className:'facts'});rows.forEach(([label,value])=>dl.append(h('div',{},[h('dt',{text:label}),h('dd',{text:value??'No aplica'})])));return dl;
  }
  function historyList(limit=null) {
    const list=h('ol',{className:'history-list'});for(const evt of current().history.slice(0,limit??undefined)){list.append(h('li',{},[h('div',{className:'history-dot'}),h('div',{},[h('strong',{text:evt.note}),h('small',{text:`${findRole(evt.by)?.name||evt.by} · ${evt.action}`})])]));}return list;
  }
  function caseView(){const r=h('div',{className:'stack'});r.append(caseHeader(),summaryCards());const layout=h('div',{className:'columns'});const a=h('section',{className:'panel'}),b=h('section',{className:'panel'});a.append(sectionTitle('FICHA DEL CASO','Datos y consecuencias'),detailFacts());b.append(sectionTitle('TRAZABILIDAD','Bitácora compartida'),historyList());layout.append(a,b);r.append(layout);return r;}
  function journeyView(){const root=h('div',{className:'stack'});root.append(h('div',{className:'info-banner'},[h('span',{className:'info-symbol',text:'↝'}),h('div',{},[h('strong',{text:scenario().name}),h('p',{text:scenario().objective})])]));const main=h('section',{className:'panel'});main.append(sectionTitle('FLUJO ENTRE ROLES','Etapas del recorrido'));const steps=h('ol',{className:'journey'});scenario().stages.forEach((step,i)=>{const row=h('li',{className:`journey-step ${caseState().stage===step.id?'current':''}`});row.append(h('span',{className:'step-num',text:i+1}),h('div',{},[h('strong',{text:step.label}),h('p',{text:step.description}),h('small',{text:`Responsable: ${step.owner?findRole(step.owner)?.name||step.owner:'Ninguno'} · Pantalla ${step.screenId||'sin asignar'}`})]));steps.append(row);});main.append(steps);root.append(main);return root;}
  function downloadJSON(filename, obj) {
    const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function reviewView(){
    const root=h('div',{className:'stack'});root.append(h('div',{className:'info-banner'},[h('span',{className:'info-symbol',text:'!'}),h('div',{},[h('strong',{text:'La aprobación no ocurre automáticamente.'}),h('p',{text:'Registra observaciones y descarga evidencia para que Product Studio la incorpore en GitHub tras una revisión explícita. Esta página no envía datos a un servidor.'})])]));
    const layout=h('div',{className:'columns'}),left=h('section',{className:'panel'}),right=h('section',{className:'panel'});left.append(sectionTitle('REVISIÓN','Evaluación del escenario'));
    const rev=current().review||{verdict:'pending',comments:'',requirements:[]};
    const choices=h('div',{className:'review-choices'});[['pending','Pendiente'],['changes','Solicitar cambios'],['approved','Proponer aprobación']].forEach(([id,label])=>{const wrap=h('label',{className:'choice'});const inp=h('input',{attrs:{type:'radio',name:'verdict',value:id}});inp.checked=rev.verdict===id;inp.addEventListener('change',()=>{rev.verdict=id;toSave();});wrap.append(inp,document.createTextNode(' '+label));choices.append(wrap);});left.append(h('label',{className:'form-label',text:'Resultado de la revisión'}),choices);
    const ta=h('textarea',{attrs:{rows:'5',placeholder:'Qué funciona, qué falta y qué debe cambiar…','aria-label':'Comentarios de revisión'}});ta.value=rev.comments||'';ta.addEventListener('input',()=>{rev.comments=ta.value;toSave();});left.append(h('label',{className:'form-label',text:'Observaciones del cliente'}),ta);
    const btns=h('div',{className:'action-buttons'});btns.append(button('Exportar evaluación JSON',()=>{downloadJSON(`${scenario().id}-revision.json`,{schemaVersion:1,scenario:scenario().id,product:config.product.name,version:config.product.version,case:caseState(),review:rev,checkedRequirements:rev.requirements,history:current().history,generatedAt:new Date().toISOString(),note:'Revisión local no equivale a aprobación formal en el repositorio.'});showToast('Evaluación descargada.')}));left.append(btns);
    right.append(sectionTitle('CRITERIOS DE ACEPTACIÓN','Puntos a comprobar'));const checks=h('div',{className:'checks'});for(const ac of scenario().acceptance){const wrap=h('label',{className:'check-row'});const inp=h('input',{attrs:{type:'checkbox',value:ac.id}});inp.checked=rev.requirements.includes(ac.id);inp.addEventListener('change',()=>{rev.requirements=inp.checked?[...new Set([...rev.requirements,ac.id])]:rev.requirements.filter(x=>x!==ac.id);toSave();});wrap.append(inp,h('span',{},[h('strong',{text:ac.id}),document.createTextNode(` · ${ac.title}`)]));checks.append(wrap);}    right.append(checks);layout.append(left,right);root.append(layout);
    const ux=(config.uxDecisions||[]).filter(x=>x.flowId===scenario().id);
    if(ux.length){
      const compare=h('section',{className:'panel'});compare.append(sectionTitle('ALTERNATIVAS UX','Comparar opciones antes de aprobar'));
      const intro=h('p',{className:'ux-intro',text:'Selecciona qué propuesta conviene explorar. Aquí solo registramos preferencias; un cliente debe probar los diseños concretos antes de aprobarlos.'});compare.append(intro);
      for(const decision of ux){
        const group=h('fieldset',{className:'ux-choice'});group.append(h('legend',{text:`${decision.id} · ${decision.question}`}));
        const currentChoice=rev.uxChoices?.[decision.id]||'';
        for(const option of decision.options){
          const label=h('label',{className:'ux-option'}),input=h('input',{attrs:{type:'radio',name:decision.id,value:option.id}});
          input.checked=currentChoice===option.id;
          input.addEventListener('change',()=>{rev.uxChoices=rev.uxChoices||{};rev.uxChoices[decision.id]=option.id;toSave();});
          label.append(input,h('span',{},[h('strong',{text:option.label}),h('small',{text:option.tradeoff})]));group.append(label);
        }
        compare.append(group);
      }
      root.append(compare);
    }
    return root;
  }
  function render(){renderMenu();const data=current();const views={work:workView,case:caseView,journey:journeyView,review:reviewView};const definition=viewDefinitions.find(v=>v.id===data.view)||viewDefinitions[0];$('breadcrumb').textContent=definition.title;$('heading').textContent=definition.title;$('lead').textContent=data.view==='work'?'Actividades en contexto, sin pantallas aisladas.':scenario().objective;$('flowId').textContent=`${scenario().id} · ${scenario().name.toUpperCase()}`;$('version').textContent=config.product.version;const el=$('content');el.replaceChildren((views[data.view]||workView)());}
  $('reset').addEventListener('click',()=>confirmAction('Reiniciar escenario','Se borrarán los cambios ficticios únicamente del escenario activo.',()=>{store.records[store.active]=freshScenario(scenario());toSave();render();showToast('Escenario reiniciado.');}));
  render();
})();
