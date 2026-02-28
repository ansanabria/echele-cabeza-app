# Abelardo de la Espriella Romero — Perfil de candidato presidencial 2026

> **Instrucciones de uso:** Este archivo mapea directamente los campos del CMS (colección `Candidates`).
> Cada sección indica el campo exacto al que corresponde el contenido.
> Las fotos (candidato, logos de partido, avales) se suben manualmente en el admin.
> Las fuentes al final del documento deben ingresarse en el arreglo global `sources` del CMS.

---

## Campos del sidebar

| Campo           | Valor                                                                               |
| --------------- | ----------------------------------------------------------------------------------- |
| `name`          | Abelardo de la Espriella Romero                                                     |
| `slug`          | `abelardo-de-la-espriella`                                                          |
| `party`         | Salvación Nacional                                                                  |
| `currentOffice` | Ninguno — abogado penalista, empresario y candidato presidencial independiente 2026 |
| `lastUpdated`   | 2026-02-28                                                                          |

### Redes sociales (`socialLinks`)

| Plataforma  | URL                                      |
| ----------- | ---------------------------------------- |
| `x`         | https://twitter.com/delaespriellae       |
| `instagram` | https://www.instagram.com/delaespriellae |
| `facebook`  | https://www.facebook.com/delaespriellae  |
| `youtube`   | https://www.youtube.com/@delaespriellae  |

> Nota de investigación: Los handles de Facebook y YouTube se basan en el patrón del resto de sus cuentas confirmadas. Verificar en el admin antes de publicar.

---

## Sección 1 — Biografía y trayectoria (`biography` + `publicTrajectoryItems` + `privateTrajectoryItems`)

### `biography` (texto narrativo)

Abelardo de la Espriella Romero nació en Barranquilla. Es abogado penalista de amplia trayectoria, conocido popularmente como "El Tigre de la Patria". Cursó su carrera de Derecho y obtuvo posteriormente una maestría en derecho, cuyo director de tesis fue Wilson Ruiz Orejuela, exministro de Justicia del gobierno de Iván Duque. Vivió una temporada en Italia, experiencia que incorporó a su identidad pública y a la marca de su firma de abogados.

Fundó en 2004 el bufete De la Espriella Lawyers, que se convirtió en una de las firmas de defensa penal más reconocidas del país. A lo largo de su carrera representó a clientes de alto perfil en casos de gran resonancia pública, incluyendo a David Murcia Guzmán, fundador de la pirámide DMG (2008), y a Álex Saab, ciudadano venezolano-colombiano detenido en Estados Unidos y señalado de ser testaferro del régimen de Nicolás Maduro. Paralelamente desarrolló una faceta como escritor, cantante, diseñador de moda (De la Espriella Style) y empresario del entretenimiento, co-lanzando en 2022 el ron Ron Defensor junto al cantante de vallenato Silvestre Dangond.

En 2026 lanzó su primera candidatura a la presidencia de la República, sin haber ocupado antes ningún cargo de elección popular. Se presenta como outsider político, con un discurso marcadamente anti-petrista, de defensa de los valores familiares y religiosos tradicionales, y de autoridad estatal frente a los grupos armados ilegales. Obtuvo el aval del partido Salvación Nacional, dirigido por Enrique Gómez Martínez, y construyó una base electoral importante entre comunidades evangélicas y cristianas. Su campaña se distingue por un estilo de evento cercano al espectáculo: jingle urbano, producción escénica y rituales de participación con el público.

> Nota de investigación: Fecha exacta de nacimiento (día y mes) no confirmada en las fuentes consultadas. Verificar con documentos oficiales o comunicado de campaña antes de publicar.

### `publicTrajectoryItems`

> Nota de investigación: De la Espriella nunca ha ocupado un cargo público elegido ni de carrera administrativa. No existen ítems de trayectoria pública en el sentido gubernamental. Los roles relevantes son todos privados (ver abajo).

### `privateTrajectoryItems`

```
1.
  role: Abogado penalista y fundador
  organization: De la Espriella Lawyers
  startYear: 2004
  location: Barranquilla / Bogotá
  description: Fundó y dirige la firma de abogados De la Espriella Lawyers, especializada en defensa penal de alto perfil. Al cierre de 2024 registró un patrimonio de 16,5 mil millones de pesos y fue la única empresa del grupo con utilidades positivas.

2.
  role: Empresario (marca de moda y contenido)
  organization: De la Espriella Style SAS
  startYear: ~2018
  location: Colombia
  description: Empresa dedicada a libros, moda, podcast y un proyecto de apartasuites. Cerró 2024 con pérdidas de 26 millones de pesos y patrimonio negativo.

3.
  role: Co-fundador y socio (ron artesanal)
  organization: Dominio De la Espriella SAS (Ron Defensor / Vino Fratellone)
  startYear: 2022
  location: Colombia
  description: Lanzó en 2022 el ron Ron Defensor (ediciones de 12 y 18 años) junto al cantante Silvestre Dangond y otros socios. La empresa cerró 2024 con pérdidas de 552 millones de pesos y patrimonio negativo.

4.
  role: Socio y empresario (restaurante)
  organization: Místico Group LLC
  startYear: ~2021
  location: Miami, Florida, Estados Unidos
  description: Restaurante en Miami co-propiedad con Silvestre Dangond, Héctor Amarís y otros socios.

5.
  role: Candidato presidencial
  organization: Salvación Nacional
  startYear: 2025
  location: Colombia
  description: Anunció su candidatura presidencial para las elecciones de 2026. Primera aspiración a cargo de elección popular. Obtuvo el aval del partido Salvación Nacional sin participar en la consulta presidencial del 8 de marzo de 2026.
```

---

## Sección 2 — Propuestas (`proposals` + `proposalItems`)

### `proposals` (texto introductorio)

Las propuestas de De la Espriella han sido presentadas principalmente en actos de campaña, entrevistas y en su programa de gobierno publicado en redes sociales. Se estructuran en torno a cuatro ejes: reducción del Estado y rebaja de impuestos, defensa de los valores familiares y religiosos, seguridad con mano dura y desmonte del proyecto político de Gustavo Petro. Al momento de edición de este perfil no existe un documento de programa de gobierno oficial y exhaustivo publicado en su sitio web.

> Nota de investigación: El sitio web oficial de la campaña (www.delaespriella.com.co) no respondió durante la consulta (28 de febrero de 2026). Las propuestas a continuación se basan en declaraciones públicas registradas por La Silla Vacía y otros medios. Actualizar cuando el programa oficial esté disponible.

### `proposalItems`

```
1.
  title: Reducción del Estado y rebaja de impuestos
  description: Propone reducir el tamaño del aparato estatal y disminuir la carga tributaria sobre las empresas y ciudadanos. Defiende que los bancos deben poder prestar a tasas cercanas al 2%.
  topic: economia
  sourceTitle: "El showman, Abelardo De La Espriella: los actos de su campaña" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  sourceTier: prensa

2.
  title: Defensa de la familia tradicional y reforma constitucional anti-aborto
  description: Propone reformar la Constitución para prohibir el aborto y proteger la definición de familia como unidad entre hombre y mujer. Rechaza lo que denomina "ideología de género" en las escuelas y propone remover la influencia de Fecode en el currículo escolar.
  topic: social
  sourceTitle: "El showman, Abelardo De La Espriella: los actos de su campaña" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  sourceTier: prensa

3.
  title: Suspensión o eliminación de la JEP
  description: Propone suspender o abolir la Jurisdicción Especial para la Paz (JEP). Afirma tener listo un decreto presidencial para ejecutar esta medida desde el primer día de gobierno.
  topic: justicia
  sourceTitle: "De la Espriella asume el riesgo de contarse mal con Salvación Nacional" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/de-la-espriella-asume-el-riesgo-de-contarse-mal-con-salvacion-nacional/
  sourceTier: prensa

4.
  title: Seguridad con mano dura — sin negociaciones con grupos armados
  description: Rechaza los diálogos de paz con organizaciones armadas ilegales. Propone el uso de la fuerza militar como respuesta prioritaria frente a grupos guerrilleros y criminales.
  topic: seguridad
  sourceTitle: "El showman, Abelardo De La Espriella: los actos de su campaña" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  sourceTier: prensa

5.
  title: Mantenimiento del sistema de EPS en salud
  description: Se opone a la reforma de salud de Petro. Propone mantener el esquema de Empresas Promotoras de Salud (EPS) como operadoras del sistema.
  topic: salud
  sourceTitle: "El showman, Abelardo De La Espriella: los actos de su campaña" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  sourceTier: prensa

6.
  title: Reforma constitucional para que militares puedan votar
  description: Propone reformar la Constitución para permitir que los miembros activos de las Fuerzas Militares y la Policía Nacional ejerzan el derecho al voto.
  topic: institucional
  sourceTitle: "El showman, Abelardo De La Espriella: los actos de su campaña" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  sourceTier: prensa

7.
  title: Descentralización y fortalecimiento de las provincias
  description: Propone descentralizar funciones del Estado central hacia las regiones y fortalecer el papel de las provincias en la administración pública.
  topic: institucional
  sourceTitle: "El showman, Abelardo De La Espriella: los actos de su campaña" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  sourceTier: prensa
```

---

## Sección 3 — Escándalos y controversias (`controversies` + `controversyItems`)

### `controversies` (texto introductorio)

Las principales controversias que rodean la campaña de De la Espriella se derivan de su trayectoria como abogado defensor de clientes de alto perfil —incluyendo personas condenadas o investigadas por narcotráfico, paramilitarismo o corrupción— y de la composición de su entorno empresarial. La investigación publicada por La Silla Vacía en enero de 2026 documentó en detalle su universo de empresas en Colombia, Estados Unidos y Panamá, con hallazgos que contradicen el relato de "empresario exitoso" que la campaña proyecta. Adicionalmente, la campaña ha sido señalada por ejercer presión judicial contra periodistas y por difundir información falsa sobre el financiamiento de medios críticos.

### `controversyItems`

```
1.
  title: Defensa de David Murcia Guzmán (pirámide DMG)
  description: En 2008, De la Espriella fue el principal abogado defensor de David Murcia Guzmán, fundador de la pirámide financiera DMG que defraudó a decenas de miles de colombianos. En febrero de 2026, Murcia hizo declaraciones públicas acusando a De la Espriella de conductas no especificadas. De la Espriella respondió denunciándolo por injuria y calumnia ante la Fiscalía General de la Nación.
  status: suspicion
  year: 2008
  sourceTitle: "Abelardo denunció a su excliente David Murcia por injuria y calumnia" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/en-vivo/abelardo-denuncio-a-su-excliente-david-murcia-por-injuria-y-calumnia/
  sourceTier: prensa

2.
  title: Defensa de Álex Saab, señalado testaferro de Nicolás Maduro
  description: De la Espriella representó legalmente a Álex Saab, ciudadano de origen libanés-colombiano detenido en Estados Unidos y acusado por el Departamento de Justicia (DOJ) de ser un testaferro del régimen venezolano de Nicolás Maduro. El exsocio de De la Espriella, Daniel Peñarredonda, mantiene vínculos documentados con la esposa de Saab, Camila Fabri.
  status: suspicion
  year: 2020
  sourceTitle: "El universo empresarial De la Espriella: socios cuestionados, saldos en rojo y bienes raíces" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-universo-empresarial-de-la-espriella-socios-cuestionados-saldos-en-rojo-y-bienes-raices/
  sourceTier: prensa

3.
  title: Socios con antecedentes por paramilitarismo, narcotráfico y corrupción en Ron Defensor
  description: La Silla Vacía identificó que entre los 14 accionistas de Dominio De la Espriella SAS (empresa del ron Ron Defensor), varios tienen antecedentes graves: Hugues Rodríguez Fuentes, condenado por paramilitarismo ("Comandante Barbie"); Aniano Iglesias, señalado de ser cuota de políticos y vinculado a bienes incautados por narcotráfico en 2011; y Juan Carlos Gossaín, exgobernador de Bolívar destituido e inhabilitado por el escándalo del "cartel de la hemofilia". La campaña de De la Espriella se negó a responder preguntas al respecto.
  status: suspicion
  year: 2026
  sourceTitle: "El universo empresarial De la Espriella: socios cuestionados, saldos en rojo y bienes raíces" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-universo-empresarial-de-la-espriella-socios-cuestionados-saldos-en-rojo-y-bienes-raices/
  sourceTier: prensa

4.
  title: Universo empresarial con pérdidas netas pese al relato de "empresario exitoso"
  description: La investigación de La Silla Vacía (enero de 2026) encontró que el conjunto de empresas colombianas de De la Espriella cerró el año 2024 con una pérdida neta de 159 millones de pesos, a pesar de ingresos totales de 16,1 mil millones. Dos de sus empresas registraron patrimonio negativo. Esto contrasta con el relato de emprendedor próspero que proyecta la campaña.
  status: suspicion
  year: 2026
  sourceTitle: "El universo empresarial De la Espriella: socios cuestionados, saldos en rojo y bienes raíces" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-universo-empresarial-de-la-espriella-socios-cuestionados-saldos-en-rojo-y-bienes-raices/
  sourceTier: prensa

5.
  title: Acoso judicial a la prensa (estrategia del abogado Germán Calderón)
  description: El abogado de la campaña, Germán Calderón España —exasesor del Pacto Histórico—, ha enviado requerimientos legales y amenazas de demanda a periodistas y columnistas que han cubierto críticamente a De la Espriella. La Fundación para la Libertad de Prensa (FLIP) ha caracterizado estas acciones como hostigamiento judicial contra medios de comunicación.
  status: suspicion
  year: 2026
  sourceTitle: "De petrista a abelardista: el giro de Germán Calderón, abogado de la campaña De la Espriella" — La Silla Vacía
  sourceUrl: https://www.lasillavacia.com/silla-nacional/el-giro-de-german-calderon-abogado-de-la-campana-de-la-espriella/
  sourceTier: prensa

6.
  title: Campaña difundió información falsa sobre financiamiento Soros a medios
  description: La campaña de De la Espriella difundió públicamente la afirmación de que La Silla Vacía y otros medios de comunicación que lo cubrieron críticamente reciben financiamiento de George Soros y la Open Society Foundations. La directora de La Silla Vacía, Juanita León, publicó el 17 de enero de 2026 una solicitud pública de rectificación demostrando que la afirmación era falsa.
  status: suspicion
  year: 2026
  sourceTitle: "Solicitud de rectificación a la campaña de la Espriella" — La Silla Vacía (Juanita León)
  sourceUrl: https://www.lasillavacia.com/opinion/solicitud-publica-de-rectificacion-a-la-campana-de-la-espriella/
  sourceTier: prensa
```

---

## Sección 4 — Alianzas y avales (`alliances` + `allianceParties` + `endorsers`)

### `alliances` (texto introductorio)

El soporte político de De la Espriella descansa sobre tres pilares: el partido Salvación Nacional (que le da personería jurídica para la candidatura), el sector evangélico y cristiano (su mayor activo electoral según analistas), y figuras del establecimiento de centro-derecha y uribismo que le han dado señales de simpatía sin un respaldo formal. De la Espriella optó deliberadamente por no entrar a la consulta de la centro-derecha del 8 de marzo de 2026, apostando a que Salvación Nacional supere el umbral electoral con sus propias listas al Congreso.

### `allianceParties`

```
1.
  name: Salvación Nacional
  (logo: subir manualmente)

```

### `endorsers`

```
1.
  name: Enrique Gómez Martínez
  description: Director de Salvación Nacional y candidato al Senado. Presente en todos los eventos de campaña de De la Espriella; salta con él en tarima.

2.
  name: Jaime Andrés Beltrán
  description: Pastor y exalcalde de Bucaramanga (elección anulada por doble militancia; logró reelegirse mediante su exsecretario privado). Gerente regional de la campaña para Santander. Organizó eventos multitudinarios en Bucaramanga e iglesias evangélicas.

3.
  name: Marco Acosta
  description: Pastor de la iglesia "Dios está Formando un Pueblo" y concejal de Bogotá (20.000 votos en 2023). Gerente nacional de la "fe" de la campaña; articula la red de líderes religiosos a lo largo del país.

4.
  name: Sara Castellanos
  description: Candidata al Congreso por Salvación Nacional; hija de los fundadores de la Misión Carismática Internacional (MCI), iglesia con presencia en más de 10 países y al menos 60 campus en Colombia. Acompañó a De la Espriella en tarima en Bucaramanga.

5.
  name: Wilson Ruiz Orejuela
  description: Exministro de Justicia del gobierno Duque. Fue director de tesis de maestría de De la Espriella. Candidato al Senado por Salvación Nacional.

6.
  name: General (r) Jorge Mora
  description: Excomandante de las Fuerzas Militares. Ha expresado apoyo público a la candidatura de De la Espriella.

7.
  name: Silvestre Dangond
  description: Cantante de vallenato y socio empresarial en Ron Defensor y el restaurante Místico en Miami. Referente de la imagen de la campaña.
```

> Nota de investigación: Dilian Francisca Toro (Partido de la U), Hernán Andrade (Conservador), Carlos Fernando Mejía y Juan Camilo Ostos han dado señales de simpatía pero sin respaldo formal confirmado a la fecha de este perfil. No incluir como avales hasta confirmación.

---

## Sección 5 — Registro legislativo y en ejercicio (`record`)

### `record` (texto narrativo)

Abelardo de la Espriella no ha ocupado ningún cargo de elección popular ni cargo público de carrera administrativa en ningún nivel de gobierno. No tiene registro legislativo, votaciones, proyectos de ley ni gestión ejecutiva que reseñar.

Su trayectoria verificable es enteramente privada: más de 20 años como abogado penalista, con representación de clientes en casos de alta complejidad ante los tribunales colombianos y en el plano internacional. Su firma, De la Espriella Lawyers, es reconocida en el ámbito del derecho penal de alto perfil.

Esta candidatura presidencial de 2026 es su primera participación formal en política electoral.

---

## Sección 6 — Patrimonio, financiación y campaña (`funding`)

### `funding` (texto narrativo)

De la Espriella ha sostenido en campaña que se financia de manera independiente, sin depender de los partidos o grupos políticos tradicionales. No existe declaración de bienes ante el SIGEP (Sistema de Información y Gestión del Empleo Público) porque nunca ha sido servidor público.

La investigación publicada por La Silla Vacía el 13 de enero de 2026 documentó su universo patrimonial a partir de registros públicos en Colombia, Estados Unidos (Florida) y Panamá. Los hallazgos principales son:

**Colombia:**

- 19 propiedades en Bogotá (zona T), Barranquilla (centro histórico), Puerto Colombia, Galapa, Montería, Cereté, Santa Marta y Purificación.
- El patrimonio combinado de sus empresas colombianas asciende a aproximadamente 19,7 mil millones de pesos (unos 5,2 millones de dólares), aunque dos de ellas tienen patrimonio negativo.
- Sus empresas colombianas cerraron el año 2024 con una pérdida neta de 159 millones de pesos a pesar de ingresos totales de 16,1 mil millones.

**Estados Unidos (Florida):**

- Una mansión en Miami-Dade County valorada en **5,1 millones de dólares**, inscrita a nombre de De la Espriella y su esposa Ana Lucía Pineda Aruachan.
- Una segunda propiedad en Florida valuada en 628.000 dólares, adquirida a través de la empresa SGS Investments Global LLC.
- 14 empresas en Florida constituidas entre 2013 y 2023, de las cuales 7 permanecían activas al momento de la publicación.

**Panamá:**

- 3 empresas; 1 activa al momento de la investigación (Reva Entreprises, suspendida temporalmente por no actualizar registros).

Los informes de financiación de campaña ante el Consejo Nacional Electoral (CNE) no estaban disponibles al momento de edición de este perfil (campaña en curso).

---

## Campos resumen para la página de comparación

| Campo                  | Texto (2–3 oraciones, tono neutro)                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `summaryTrajectory`    | Abogado penalista barranquillero sin cargos de elección popular previos. Fundó en 2004 el bufete De la Espriella Lawyers y es conocido por defender casos de alto perfil. Esta es su primera candidatura política.                                            |
| `summaryProposals`     | Sus propuestas se centran en reducir el Estado, bajar impuestos, suspender la JEP y rechazar negociaciones con grupos armados. También propone reformas constitucionales para prohibir el aborto y permitir el voto de militares activos.                     |
| `summaryControversies` | La Silla Vacía documentó socios con antecedentes penales en su empresa de ron y un déficit neto en sus compañías colombianas que contrasta con su imagen de empresario exitoso. Su campaña también ha sido señalada por hostigar judicialmente a periodistas. |
| `summaryAlliances`     | Cuenta con el aval de Salvación Nacional y un sólido respaldo del sector evangélico y cristiano, articulado a través de pastores con estructuras electorales propias en varias regiones del país.                                                             |
| `summaryRecord`        | No tiene registro en cargos públicos ni legislativos. Su carrera ha transcurrido íntegramente en el ejercicio privado del derecho penal.                                                                                                                      |
| `summaryFunding`       | Afirma autofinanciarse. Tiene documentados bienes en Colombia, Florida (incluyendo una mansión de 5,1 millones de dólares en Miami-Dade) y Panamá. Los informes de financiación de campaña ante el CNE no están disponibles aún.                              |

---

## Fuentes (`sources` — arreglo global del CMS)

```
1.
  section: biography
  title: "El universo empresarial De la Espriella: socios cuestionados, saldos en rojo y bienes raíces"
  publishedAt: 2026-01-13
  url: https://www.lasillavacia.com/silla-nacional/el-universo-empresarial-de-la-espriella-socios-cuestionados-saldos-en-rojo-y-bienes-raices/
  tier: prensa

2.
  section: controversies
  title: "El universo empresarial De la Espriella: socios cuestionados, saldos en rojo y bienes raíces"
  publishedAt: 2026-01-13
  url: https://www.lasillavacia.com/silla-nacional/el-universo-empresarial-de-la-espriella-socios-cuestionados-saldos-en-rojo-y-bienes-raices/
  tier: prensa

3.
  section: controversies
  title: "De petrista a abelardista: el giro de Germán Calderón, abogado de la campaña De la Espriella"
  publishedAt: 2026-01-26
  url: https://www.lasillavacia.com/silla-nacional/el-giro-de-german-calderon-abogado-de-la-campana-de-la-espriella/
  tier: prensa

4.
  section: controversies
  title: "Solicitud pública de rectificación a la campaña de la Espriella" (Juanita León)
  publishedAt: 2026-01-17
  url: https://www.lasillavacia.com/opinion/solicitud-publica-de-rectificacion-a-la-campana-de-la-espriella/
  tier: prensa

5.
  section: controversies
  title: "Abelardo denunció a su excliente David Murcia por injuria y calumnia"
  publishedAt: 2026-02-01
  url: https://www.lasillavacia.com/en-vivo/abelardo-denuncio-a-su-excliente-david-murcia-por-injuria-y-calumnia/
  tier: prensa

6.
  section: alliances
  title: "De la Espriella asume el riesgo de contarse mal con Salvación Nacional"
  publishedAt: 2026-02-06
  url: https://www.lasillavacia.com/silla-nacional/de-la-espriella-asume-el-riesgo-de-contarse-mal-con-salvacion-nacional/
  tier: prensa

7.
  section: alliances
  title: "El showman, Abelardo De La Espriella: los actos de su campaña"
  publishedAt: 2026-02-25
  url: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  tier: prensa

8.
  section: proposals
  title: "El showman, Abelardo De La Espriella: los actos de su campaña"
  publishedAt: 2026-02-25
  url: https://www.lasillavacia.com/silla-nacional/el-showman-abelardo-de-la-espriella-los-actos-de-su-campana/
  tier: prensa

9.
  section: funding
  title: "El universo empresarial De la Espriella: socios cuestionados, saldos en rojo y bienes raíces"
  publishedAt: 2026-01-13
  url: https://www.lasillavacia.com/silla-nacional/el-universo-empresarial-de-la-espriella-socios-cuestionados-saldos-en-rojo-y-bienes-raices/
  tier: prensa

10.
  section: alliances
  title: "Hub candidato Abelardo de la Espriella — La Silla Vacía"
  publishedAt: 2026-02-28
  url: https://www.lasillavacia.com/abelardo-de-la-espriella-candidato-presidencial-2026/
  tier: prensa
```
