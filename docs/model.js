/* GENERADO desde product-contract.json · no editar directamente */
window.PRODUCT_STUDIO_MODEL = {
  "schemaVersion": 1,
  "contractVersion": "2.0-draft.2",
  "product": {
    "name": "Qualitra",
    "subtitle": "Formularios auditables para calidad y cumplimiento",
    "version": "2.0-draft.2",
    "description": "Propuesta visual navegable para revisión del recorrido form-first de configuración, publicación, captura y consulta.",
    "disclaimer": "PROPUESTA NO APROBADA. Demo privada con datos completamente ficticios y sin efectos reales."
  },
  "roles": [
    {
      "id": "ADMINISTRADOR",
      "name": "Administrador",
      "initials": "AD",
      "purpose": "Configurar, probar y publicar formularios autorizados."
    },
    {
      "id": "CAPTURISTA",
      "name": "Capturista",
      "initials": "CA",
      "purpose": "Crear, conservar, recuperar y finalizar registros."
    },
    {
      "id": "SUPERVISOR",
      "name": "Supervisor",
      "initials": "SU",
      "purpose": "Consultar resultados e historial dentro de su alcance."
    }
  ],
  "requirements": [
    {
      "id": "RF-001",
      "title": "Identificadores estables ante cambios de etiqueta",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-002",
      "title": "Versiones publicadas inmutables",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-004",
      "title": "El estado Guardado sólo aparece tras conservación confirmada",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-005",
      "title": "Los conflictos simultáneos no sobrescriben cambios silenciosamente",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-006",
      "title": "Los permisos se aplican más allá de la interfaz",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-007",
      "title": "Las acciones relevantes generan auditoría desde su origen",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-016",
      "title": "La experiencia habitual inicia desde un formulario comprensible",
      "status": "PROPUESTA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-020",
      "title": "Un formulario publicado crea registros persistentes y versionados",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-021",
      "title": "Los borradores son recuperables y pueden finalizarse o descartarse",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-022",
      "title": "Una captura abierta tolera interrupción momentánea sin duplicar",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    },
    {
      "id": "RF-023",
      "title": "El usuario conserva su captura durante un conflicto",
      "status": "FUENTE_APROBADA",
      "flows": [
        "FL-001"
      ]
    }
  ],
  "scenarios": [
    {
      "id": "FL-001",
      "name": "Diseñar, publicar, capturar y consultar",
      "objective": "Demostrar en un recorrido único que Qualitra convierte un formulario configurable en un registro persistente, recuperable, versionado y consultable.",
      "source": "SRC-001 + DEC-004 + auditoría SyStudio del 22-oct-2026",
      "status": "PROPUESTA_NO_APROBADA",
      "personas": [
        "ADMINISTRADOR",
        "CAPTURISTA",
        "SUPERVISOR"
      ],
      "initialCase": {
        "id": "EVP-DEMO-001",
        "title": "Evaluación de proveedor",
        "customer": "Organización Demo",
        "equipment": "Proveedor ficticio: Empaques Horizonte Demo",
        "stage": "configuration",
        "values": {
          "formName": "Evaluación de proveedor",
          "fieldsReady": false,
          "published": false,
          "supplier": null,
          "saved": false,
          "online": true,
          "hasConflict": false,
          "requiredComplete": true,
          "score": null,
          "classification": null,
          "finalized": false
        }
      },
      "stages": [
        {
          "id": "configuration",
          "label": "Configuración en borrador",
          "owner": "ADMINISTRADOR",
          "description": "Definir la estructura y presentación sin crear capturas productivas.",
          "screenId": "UI-001"
        },
        {
          "id": "preview",
          "label": "Vista previa",
          "owner": "ADMINISTRADOR",
          "description": "Probar campos, repetibles, condiciones y cálculo con datos ficticios.",
          "screenId": "UI-002"
        },
        {
          "id": "published",
          "label": "Formulario publicado",
          "owner": "CAPTURISTA",
          "description": "La versión inmutable está disponible dentro del alcance autorizado.",
          "screenId": "UI-003"
        },
        {
          "id": "capture",
          "label": "Captura en curso",
          "owner": "CAPTURISTA",
          "description": "Completar datos con estado de conservación visible.",
          "screenId": "UI-004"
        },
        {
          "id": "draft",
          "label": "Borrador guardado",
          "owner": "CAPTURISTA",
          "description": "Continuar posteriormente desde la última conservación confirmada.",
          "screenId": "UI-005"
        },
        {
          "id": "offline",
          "label": "Cambios pendientes",
          "owner": "CAPTURISTA",
          "description": "Conservar captura durante una interrupción momentánea.",
          "screenId": "UI-006"
        },
        {
          "id": "conflict",
          "label": "Conflicto detectado",
          "owner": "CAPTURISTA",
          "description": "Comparar la versión actual sin perder cambios locales.",
          "screenId": "UI-007"
        },
        {
          "id": "validation_error",
          "label": "Corrección requerida",
          "owner": "CAPTURISTA",
          "description": "Explicar los obligatorios sin borrar la captura.",
          "screenId": "UI-008"
        },
        {
          "id": "finalized",
          "label": "Registro finalizado",
          "owner": "SUPERVISOR",
          "description": "Resultado autoritativo con versión, autor, fecha y clasificación.",
          "screenId": "UI-009"
        },
        {
          "id": "consulted",
          "label": "Registro consultado",
          "owner": null,
          "description": "Recorrido completado y disponible para evidencia.",
          "screenId": "UI-010"
        }
      ],
      "actions": [
        {
          "id": "A-001",
          "from": "configuration",
          "to": "preview",
          "by": "ADMINISTRADOR",
          "label": "Previsualizar formulario",
          "note": "Qualitra conserva el borrador y muestra el comportamiento candidato.",
          "effect": {
            "fieldsReady": true
          },
          "inputs": [
            {
              "id": "formName",
              "label": "Nombre del formulario",
              "type": "text",
              "required": true,
              "minLength": 3,
              "default": "Evaluación de proveedor"
            }
          ]
        },
        {
          "id": "A-002",
          "from": "preview",
          "to": "configuration",
          "by": "ADMINISTRADOR",
          "label": "Corregir configuración",
          "note": "Volver al constructor conserva los cambios y no crea registros."
        },
        {
          "id": "A-003",
          "from": "preview",
          "to": "published",
          "by": "ADMINISTRADOR",
          "label": "Publicar versión",
          "note": "Se crea una versión inmutable disponible para los roles autorizados.",
          "effect": {
            "published": true
          },
          "guards": [
            {
              "field": "fieldsReady",
              "op": "eq",
              "value": true,
              "message": "Completa y prueba los campos antes de publicar."
            }
          ]
        },
        {
          "id": "A-004",
          "from": "published",
          "to": "capture",
          "by": "CAPTURISTA",
          "label": "Iniciar captura",
          "note": "Se crea un único borrador ligado a la versión publicada."
        },
        {
          "id": "A-005",
          "from": "capture",
          "to": "draft",
          "by": "CAPTURISTA",
          "label": "Guardar y salir",
          "note": "El borrador queda disponible sólo después de confirmar su conservación.",
          "effect": {
            "saved": true
          },
          "inputs": [
            {
              "id": "supplier",
              "label": "Proveedor",
              "type": "text",
              "required": true,
              "default": "Empaques Horizonte Demo"
            }
          ]
        },
        {
          "id": "A-006",
          "from": "draft",
          "to": "capture",
          "by": "CAPTURISTA",
          "label": "Reanudar borrador",
          "note": "Se recupera la última versión confirmada del mismo registro."
        },
        {
          "id": "A-007",
          "from": "capture",
          "to": "offline",
          "by": "CAPTURISTA",
          "label": "Simular pérdida de conexión",
          "note": "La interfaz conserva cambios pendientes y no afirma que estén sincronizados.",
          "effect": {
            "online": false
          }
        },
        {
          "id": "A-008",
          "from": "offline",
          "to": "capture",
          "by": "CAPTURISTA",
          "label": "Recuperar conexión",
          "note": "Los cambios se sincronizan con el mismo borrador y sin duplicarlo.",
          "effect": {
            "online": true,
            "saved": true
          }
        },
        {
          "id": "A-009",
          "from": "capture",
          "to": "conflict",
          "by": "CAPTURISTA",
          "label": "Simular cambio en otra sesión",
          "note": "Qualitra detecta una versión distinta y conserva la captura local.",
          "effect": {
            "hasConflict": true
          }
        },
        {
          "id": "A-010",
          "from": "conflict",
          "to": "capture",
          "by": "CAPTURISTA",
          "label": "Conservar mi captura",
          "note": "El usuario vuelve a editar con el conflicto documentado y sin pérdida.",
          "effect": {
            "hasConflict": false
          },
          "inputs": [
            {
              "id": "resolutionNote",
              "label": "Nota de resolución",
              "type": "textarea",
              "required": true,
              "minLength": 8,
              "default": "Revisado contra la versión actual."
            }
          ]
        },
        {
          "id": "A-011",
          "from": "capture",
          "to": "validation_error",
          "by": "CAPTURISTA",
          "label": "Probar finalización incompleta",
          "note": "Qualitra conserva la captura y señala lo necesario para finalizar.",
          "effect": {
            "requiredComplete": false
          }
        },
        {
          "id": "A-012",
          "from": "validation_error",
          "to": "capture",
          "by": "CAPTURISTA",
          "label": "Corregir campos",
          "note": "La información existente permanece y el usuario vuelve al punto de captura.",
          "effect": {
            "requiredComplete": true
          }
        },
        {
          "id": "A-013",
          "from": "capture",
          "to": "finalized",
          "by": "CAPTURISTA",
          "label": "Finalizar evaluación",
          "note": "El servidor valida y conserva 84 puntos con clasificación A PRUEBA.",
          "effect": {
            "score": 84,
            "classification": "A PRUEBA",
            "finalized": true,
            "saved": true
          },
          "guards": [
            {
              "field": "requiredComplete",
              "op": "eq",
              "value": true,
              "message": "Completa los campos obligatorios antes de finalizar."
            }
          ]
        },
        {
          "id": "A-014",
          "from": "finalized",
          "to": "consulted",
          "by": "SUPERVISOR",
          "label": "Consultar resultado e historial",
          "note": "El Supervisor comprueba versión, autor, fecha, cálculo y trazabilidad."
        }
      ],
      "acceptance": [
        {
          "id": "AC-001",
          "title": "El ciclo formulario a registro se completa entre roles",
          "requirementIds": [
            "RF-016",
            "RF-020",
            "RF-006"
          ],
          "actionIds": [
            "A-001",
            "A-003",
            "A-004",
            "A-013",
            "A-014"
          ]
        },
        {
          "id": "AC-002",
          "title": "La previsualización permite corregir sin crear registros",
          "requirementIds": [
            "RF-001",
            "RF-002"
          ],
          "actionIds": [
            "A-002"
          ]
        },
        {
          "id": "AC-003",
          "title": "El borrador se guarda y se recupera como el mismo registro",
          "requirementIds": [
            "RF-004",
            "RF-021"
          ],
          "actionIds": [
            "A-005",
            "A-006"
          ]
        },
        {
          "id": "AC-004",
          "title": "La interrupción conserva cambios pendientes sin duplicar",
          "requirementIds": [
            "RF-004",
            "RF-022"
          ],
          "actionIds": [
            "A-007",
            "A-008"
          ]
        },
        {
          "id": "AC-005",
          "title": "El conflicto conserva la captura y exige resolución",
          "requirementIds": [
            "RF-005",
            "RF-023"
          ],
          "actionIds": [
            "A-009",
            "A-010"
          ]
        },
        {
          "id": "AC-006",
          "title": "La validación fallida explica y no borra",
          "requirementIds": [
            "RF-020",
            "RF-021"
          ],
          "actionIds": [
            "A-011",
            "A-012"
          ]
        },
        {
          "id": "AC-007",
          "title": "Finalizar conserva resultado y genera auditoría",
          "requirementIds": [
            "RF-002",
            "RF-007",
            "RF-020"
          ],
          "actionIds": [
            "A-013"
          ]
        }
      ]
    }
  ],
  "screens": [
    {
      "id": "UI-001",
      "flowId": "FL-001",
      "stageId": "configuration",
      "role": "ADMINISTRADOR",
      "layout": "form",
      "title": "Constructor de formulario",
      "goal": "Definir la evaluación sin exponer complejidad técnica innecesaria.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-002",
      "flowId": "FL-001",
      "stageId": "preview",
      "role": "ADMINISTRADOR",
      "layout": "detail",
      "title": "Vista previa y prueba",
      "goal": "Comprobar condiciones, repetibles y cálculo antes de publicar.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-003",
      "flowId": "FL-001",
      "stageId": "published",
      "role": "CAPTURISTA",
      "layout": "queue",
      "title": "Formularios disponibles",
      "goal": "Encontrar y comenzar la evaluación autorizada.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-004",
      "flowId": "FL-001",
      "stageId": "capture",
      "role": "CAPTURISTA",
      "layout": "form",
      "title": "Captura de evaluación",
      "goal": "Completar el trabajo con conservación y estado visibles.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-005",
      "flowId": "FL-001",
      "stageId": "draft",
      "role": "CAPTURISTA",
      "layout": "queue",
      "title": "Mis borradores",
      "goal": "Reconocer y reanudar el mismo registro.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-006",
      "flowId": "FL-001",
      "stageId": "offline",
      "role": "CAPTURISTA",
      "layout": "form",
      "title": "Cambios pendientes",
      "goal": "Continuar la captura comprendiendo qué todavía no está sincronizado.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-007",
      "flowId": "FL-001",
      "stageId": "conflict",
      "role": "CAPTURISTA",
      "layout": "approval",
      "title": "Resolver conflicto",
      "goal": "Comparar versiones y conservar la captura antes de decidir.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-008",
      "flowId": "FL-001",
      "stageId": "validation_error",
      "role": "CAPTURISTA",
      "layout": "form",
      "title": "Correcciones necesarias",
      "goal": "Explicar cómo finalizar sin borrar información.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-009",
      "flowId": "FL-001",
      "stageId": "finalized",
      "role": "SUPERVISOR",
      "layout": "detail",
      "title": "Resultado de evaluación",
      "goal": "Comprender el resultado y su contexto histórico.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    },
    {
      "id": "UI-010",
      "flowId": "FL-001",
      "stageId": "consulted",
      "role": null,
      "layout": "detail",
      "title": "Recorrido completado",
      "goal": "Resumir la evidencia observada sin representar aprobación automática.",
      "source": "PROPUESTA_SYStudio",
      "reviewStatus": "PENDIENTE"
    }
  ],
  "uxDecisions": [
    {
      "id": "UX-001",
      "flowId": "FL-001",
      "question": "¿Cuál debe ser el punto de entrada para digitalizar un formato?",
      "options": [
        {
          "id": "A",
          "label": "Formulario primero",
          "tradeoff": "Más directo para usuarios; debe ocultar sin perder la estructura reutilizable."
        },
        {
          "id": "B",
          "label": "Tipo de registro primero",
          "tradeoff": "Modelo explícito; exige comprender arquitectura antes de ver el resultado."
        },
        {
          "id": "C",
          "label": "Asistente por propósito",
          "tradeoff": "Guía a principiantes; requiere mantener plantillas y decisiones adicionales."
        }
      ],
      "selected": "A",
      "status": "APROBADO_POR_CLIENTE"
    },
    {
      "id": "UX-002",
      "flowId": "FL-001",
      "question": "¿Cómo debe organizarse el constructor?",
      "options": [
        {
          "id": "A",
          "label": "Lienzo drag-and-drop",
          "tradeoff": "Visual, pero débil para teclado, tableta y formularios de 100 campos."
        },
        {
          "id": "B",
          "label": "Lista estructurada",
          "tradeoff": "Precisa y accesible; ofrece menos correspondencia visual inmediata."
        },
        {
          "id": "C",
          "label": "Híbrido",
          "tradeoff": "Combina lista, secciones y vista previa; exige mayor disciplina de diseño."
        }
      ],
      "selected": "C",
      "status": "RECOMENDACION_PARA_PRUEBA_VISUAL"
    },
    {
      "id": "UX-003",
      "flowId": "FL-001",
      "question": "¿Cómo comunicar guardado, conexión y conflicto?",
      "options": [
        {
          "id": "A",
          "label": "Estado global persistente",
          "tradeoff": "Siempre visible, pero puede perder contexto del campo."
        },
        {
          "id": "B",
          "label": "Estado por campo",
          "tradeoff": "Contextual, pero añade ruido en formularios largos."
        },
        {
          "id": "C",
          "label": "Global más detalle",
          "tradeoff": "Equilibra resumen y corrección; necesita una jerarquía clara."
        }
      ],
      "selected": "C",
      "status": "RECOMENDACION_PARA_PRUEBA_VISUAL"
    }
  ]
};
