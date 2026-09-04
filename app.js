const pipeline = [
  {title:'Réception',sub:'React · FastAPI',text:'Création de la soumission puis réception binaire par PUT avec contrats fermés.',limit:'Champs inattendus refusés ; 413 au-dessus du quota et 400 si le corps est vide.',icon:'document'},
  {title:'Contrôle',sub:'MIME · magic bytes',text:'Comparaison du type déclaré avec la signature binaire et détection de préfixe PDF suspect.',limit:'Une entrée incohérente, inconnue ou polyglotte est INVALID_INPUT — jamais analysée artificiellement.',icon:'shield'},
  {title:'Preuve',sub:'Original · SHA-256',text:'Conservation atomique byte-for-byte, calcul du hash et enregistrement des clés d’artefacts.',limit:'Un original existant différent n’est jamais écrasé. Un hash ne prouve pas l’authenticité initiale.',icon:'fingerprint'},
  {title:'Orchestration',sub:'SQLite · asyncio.Queue',text:'Persistance locale puis mise en file bornée. Le worker relit et re-hashe avant analyse.',limit:'La queue locale n’est pas durable en cas de crash ; la divergence de hash produit INCONCLUSIVE.',icon:'activity'},
  {title:'Détection',sub:'pypdf · pyHanko · PDFium',text:'Route PDF ou image, détecteurs bornés, rendu prudent et production de faits typés.',limit:'Toute exception ou contrôle indisponible devient une abstention explicite, jamais une preuve fabriquée.',icon:'search'},
  {title:'Décision',sub:'Policy · humain',text:'Agrégation déterministe, rapport JSON, couverture, limites et revue dans la console.',limit:'Le moteur ne refuse aucun crédit. WARNING, HIGH_RISK et INCONCLUSIVE exigent une revue humaine.',icon:'scales'}
];
const tools = [
  ['Python','3.12+','Livré','Runtime API, parsing et policy.','N’isole pas seul les parseurs hostiles.'],
  ['FastAPI','0.141.1','Livré','Routes /v1, dépendances, OpenAPI et erreurs HTTP.','Ne garantit ni sécurité objet ni qualité des détecteurs.'],
  ['Pydantic v2','2.13.5','Livré','Contrats typés et champs inconnus interdits.','Ne vérifie pas la vérité du contenu.'],
  ['MIME + magic bytes','interne','Livré','Concordance format annoncé et en-tête binaire.','Ne prouve pas que tout le contenu est bénin.'],
  ['SHA-256','standard','Livré','Intégrité interne et doublons byte-for-byte.','Un hash valide ne prouve pas l’origine.'],
  ['SQLAlchemy async','2.0.52','Livré','Transactions pour dossiers, rapports et audit.','PostgreSQL reste à valider réellement.'],
  ['SQLite + aiosqlite','0.22.1','Livré','Base mono-fichier de la démo locale.','Pas de HA ni de gouvernance production.'],
  ['LocalArtifactStore','1.0 interne','Livré','Original, aperçu et rapport écrits atomiquement.','Filesystem non HA, sans object lock.'],
  ['asyncio.Queue','Python stdlib','Livré','Queue locale bornée à 100 UUID.','Jobs perdus si le processus tombe.'],
  ['asyncio.wait_for','Python stdlib','Partiel','Timeout applicatif et retour INCONCLUSIVE.','Le thread de parsing peut continuer.'],
  ['pypdf — structure','6.16.2','Livré','Pages, ressources, révisions, polices et images.','Heuristiques incomplètes sur xref et objets actifs.'],
  ['pypdf — géométrie','6.16.2','Livré','Spans, collisions, overlays et bounding boxes.','Ne voit pas le texte aplati dans une image.'],
  ['pypdf — peinture','6.16.2','Livré','Ordre des opérations et overlays post-raster.','Interprétation partielle du clipping et des XObjects.'],
  ['pyHanko','0.37.0','Partiel','Intégrité cryptographique locale des signatures.','Trust store, révocation et eIDAS non validés.'],
  ['PDFium','4.30.0','Livré','Rendu prudent de la première page.','Pas un détecteur de fraude et pas encore sandboxé.'],
  ['Pillow','12.3.0','Livré','Décodage borné, dimensions et aperçu raster.','Ne sait pas conclure à une retouche ou IA.'],
  ['ImageHash','4.3.2','Partiel','pHash 64 bits pour futurs rapprochements.','Pas encore comparé ; collisions possibles.'],
  ['React','19.2.8','Livré','Console de revue, rapports et feedback.','N’est pas une frontière d’autorisation.'],
  ['Docker multi-stage','définition','Préparé','Build du frontend et runtime Python non-root.','Pas encore une release approuvée.'],
  ['Tesseract','5.x proposé','Cible','OCR local multilingue et bounding boxes.','Qualité à mesurer par langue et document.'],
  ['OpenCV','à évaluer','Cible','Segmentation, contours, résidus et alignement.','Chaque feature doit être calibrée.'],
  ['C2PA','validateur local','Cible','Provenance cryptographiquement liée au média.','L’absence de C2PA n’est pas suspecte.'],
  ['Modèles forensiques','poids à approuver','Expérimental','Signaux statistiques localisés et calibrés.','Jamais une autorité finale ni un score magique.'],
  ['Données réelles','validation écrite','Gate','Évaluation après DPO, Security, Legal et readiness.','Interdit sans approbation formelle.']
];
const proofs=[
  ['N0','Fichier envoyé','Octets reçus + hash','faible'],['N1','Partage d’écran','Continuité visuelle mesurée','observée'],['N2','Co-navigation','DOM et événements contrôlés','instrumentée'],['N3','Navigateur géré','Origine, réseau et téléchargement','renforcée'],['N4','Connecteur officiel','Réponse d’un flux authentifié','forte'],['N5','Attestation signée','Artefact lié à l’émetteur','positive']
];
const statusClass=s=>({'Livré':'delivered','Partiel':'partial','Cible':'target','Expérimental':'experimental','Gate':'gate','Préparé':'prepared'}[s]);
const pipeEl=document.querySelector('#pipelineList');
const detailEl=document.querySelector('#pipelineDetail');
function showPipeline(i){document.querySelectorAll('.pipe-step').forEach((el,n)=>el.classList.toggle('active',n===i));const p=pipeline[i];detailEl.innerHTML=`<div class="detail-icon"><svg><use href="#${p.icon}"/></svg></div><div><strong>${String(i+1).padStart(2,'0')} · ${p.title}</strong><p>${p.text}</p></div><small>${p.limit}</small>`;}
pipeline.forEach((p,i)=>{const b=document.createElement('button');b.className='pipe-step';b.innerHTML=`<span class="num">${String(i+1).padStart(2,'0')}</span><strong>${p.title}</strong><span>${p.sub}</span>`;b.addEventListener('click',()=>showPipeline(i));pipeEl.append(b)});showPipeline(0);
const statuses=['Tous','Livré','Partiel','Préparé','Cible','Expérimental','Gate'];let active='Tous';
const filterEl=document.querySelector('#filters');
statuses.forEach(s=>{const b=document.createElement('button');b.className='filter'+(s==='Tous'?' active':'');b.textContent=s;b.addEventListener('click',()=>{active=s;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderTools()});filterEl.append(b)});
function renderTools(){const q=document.querySelector('#toolSearch').value.trim().toLocaleLowerCase('fr');const list=tools.filter(t=>(active==='Tous'||t[2]===active)&&t.join(' ').toLocaleLowerCase('fr').includes(q));document.querySelector('#resultCount').textContent=`${list.length} brique${list.length>1?'s':''} affichée${list.length>1?'s':''}`;const grid=document.querySelector('#toolGrid');grid.replaceChildren();list.forEach(t=>{const a=document.createElement('article');a.className='tool-card';a.innerHTML=`<div class="tool-top"><div><h3>${t[0]}</h3><span class="version-number">${t[1]}</span></div><span class="status ${statusClass(t[2])}">${t[2].toUpperCase()}</span></div><p>${t[3]}</p><button type="button" aria-expanded="false">Voir la limite <span>＋</span></button><p class="tool-limit">${t[4]}</p>`;a.querySelector('button').addEventListener('click',e=>{const open=a.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))});grid.append(a)});}
document.querySelector('#toolSearch').addEventListener('input',renderTools);renderTools();
const ladder=document.querySelector('#proofLadder');proofs.forEach((p,i)=>{const a=document.createElement('article');a.className='proof-level';a.style.setProperty('--height',`${175+i*24}px`);a.innerHTML=`<b>${p[0]}</b><strong>${p[1]}</strong><p>${p[2]}</p><small>Preuve ${p[3]}</small>`;ladder.append(a)});
const sections=[...document.querySelectorAll('main section[id]')];const links=[...document.querySelectorAll('.topbar nav a')];const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash===`#${e.target.id}`))})},{rootMargin:'-35% 0px -55%'});sections.forEach(s=>observer.observe(s));
