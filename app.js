const pipeline = [
  {title:'Réception',sub:'React · FastAPI',text:'Création de la soumission puis réception binaire par PUT avec contrats fermés.',limit:'Champs inattendus refusés ; 413 au-dessus du quota et 400 si le corps est vide.',icon:'document'},
  {title:'Contrôle',sub:'MIME · magic bytes',text:'Comparaison du type déclaré avec la signature binaire et détection de préfixe PDF suspect.',limit:'Une entrée incohérente, inconnue ou polyglotte est INVALID_INPUT — jamais analysée artificiellement.',icon:'shield'},
  {title:'Preuve',sub:'Original · SHA-256',text:'Conservation atomique byte-for-byte, calcul du hash et enregistrement des clés d’artefacts.',limit:'Un original existant différent n’est jamais écrasé. Un hash ne prouve pas l’authenticité initiale.',icon:'fingerprint'},
  {title:'Orchestration',sub:'SQLite · asyncio.Queue',text:'Persistance locale puis mise en file bornée. Le worker relit et re-hashe avant analyse.',limit:'La queue locale n’est pas durable en cas de crash ; la divergence de hash produit INCONCLUSIVE.',icon:'activity'},
  {title:'Détection',sub:'pypdf · pyHanko · PDFium',text:'Route PDF ou image, détecteurs bornés, rendu prudent et production de faits typés.',limit:'Toute exception ou contrôle indisponible devient une abstention explicite, jamais une preuve fabriquée.',icon:'search'},
  {title:'Décision',sub:'Policy · humain',text:'Agrégation déterministe, rapport JSON, couverture, limites et revue dans la console.',limit:'Le moteur ne refuse aucun crédit. WARNING, HIGH_RISK et INCONCLUSIVE exigent une revue humaine.',icon:'scales'}
];
const tools = [
  ['Python','3.12+','Livré','Runtime commun de l’API, du parsing et de la policy.','N’isole pas seul les parseurs hostiles.','Socle'],
  ['React','19.2.8','Livré','Crée la soumission et présente ensuite le dossier à l’analyste.','N’est pas une frontière d’autorisation.','Entrée'],
  ['FastAPI','0.141.1','Livré','Reçoit le PUT binaire et expose les routes /v1.','Ne garantit ni sécurité objet ni qualité des détecteurs.','API'],
  ['Pydantic v2','2.13.5','Livré','Ferme et valide les contrats d’entrée et de sortie.','Ne vérifie pas la vérité du contenu.','API'],
  ['MIME + magic bytes','interne','Livré','Contrôle la concordance entre type annoncé et octets.','Ne prouve pas que tout le contenu est bénin.','Validation'],
  ['SHA-256','standard','Livré','Empreinte l’original avant toute transformation.','Un hash valide ne prouve pas l’origine.','Preuve'],
  ['LocalArtifactStore','1.0 interne','Livré','Conserve original, aperçu et rapport par écriture atomique.','Filesystem non HA, sans object lock.','Preuve'],
  ['SQLAlchemy async','2.0.52','Livré','Enregistre dossier, état, rapport, feedback et audit.','PostgreSQL reste à valider réellement.','Persistance'],
  ['SQLite + aiosqlite','0.22.1','Livré','Persiste la démo locale dans une base mono-fichier.','Pas de HA ni de gouvernance production.','Persistance'],
  ['asyncio.Queue','Python stdlib','Livré','Place l’UUID dans la file locale bornée du worker.','Jobs perdus si le processus tombe.','Orchestration'],
  ['asyncio.wait_for','Python stdlib','Partiel','Borne le temps d’analyse et retourne INCONCLUSIVE.','Le thread de parsing peut continuer.','Orchestration'],
  ['pypdf — structure','6.16.2','Livré','Inspecte pages, ressources, révisions, polices et images.','Heuristiques incomplètes sur xref et objets actifs.','Détection PDF'],
  ['pypdf — géométrie','6.16.2','Livré','Analyse spans, collisions, overlays et bounding boxes.','Ne voit pas le texte aplati dans une image.','Détection PDF'],
  ['pypdf — peinture','6.16.2','Livré','Analyse l’ordre des opérations et les overlays post-raster.','Interprétation partielle du clipping et des XObjects.','Détection PDF'],
  ['pyHanko','0.37.0','Partiel','Vérifie l’intégrité cryptographique locale des signatures.','Trust store, révocation et eIDAS non validés.','Détection PDF'],
  ['PDFium','4.30.0','Livré','Rend prudemment la première page PDF.','Pas un détecteur de fraude et pas encore sandboxé.','Rendu'],
  ['Pillow','12.3.0','Livré','Décode et borne la branche image ou le rendu dérivé.','Ne sait pas conclure à une retouche ou IA.','Détection image'],
  ['ImageHash','4.3.2','Partiel','Calcule le pHash du rendu pour futurs rapprochements.','Pas encore comparé ; collisions possibles.','Rapprochement'],
  ['Policy déterministe','document-forensics.v1.2.1','Livré','Agrège les faits et impose l’abstention ou la revue.','Ne peut produire aucun refus de crédit.','Décision'],
  ['Console analyste','React 19.2.8','Livré','Affiche faits, couverture, limites et feedback humain.','L’humain reste responsable de la conclusion.','Revue'],
  ['Docker multi-stage','définition','Préparé','Assemble frontend et runtime Python non-root.','Pas encore une release approuvée.','Déploiement'],
  ['Tesseract','5.x proposé','Cible','Ajouterait OCR local multilingue et bounding boxes.','Qualité à mesurer par langue et document.','Évolution'],
  ['OpenCV','à évaluer','Cible','Ajouterait segmentation, contours, résidus et alignement.','Chaque feature doit être calibrée.','Évolution'],
  ['C2PA','validateur local','Cible','Ajouterait une provenance cryptographiquement liée.','L’absence de C2PA n’est pas suspecte.','Évolution'],
  ['Modèles forensiques','poids à approuver','Expérimental','Ajouteraient des signaux statistiques localisés.','Jamais une autorité finale ni un score magique.','Évolution'],
  ['Données réelles','validation écrite','Gate','Permettraient l’évaluation après validations formelles.','Interdit sans approbation DPO, Security et Legal.','Gate final']
];
const proofs=[
  ['N0','Fichier envoyé','Octets reçus + hash','faible'],['N1','Partage d’écran','Continuité visuelle mesurée','observée'],['N2','Co-navigation','DOM et événements contrôlés','instrumentée'],['N3','Navigateur géré','Origine, réseau et téléchargement','renforcée'],['N4','Connecteur officiel','Réponse d’un flux authentifié','forte'],['N5','Attestation signée','Artefact lié à l’émetteur','positive']
];
const statusClass=s=>({'Livré':'delivered','Partiel':'partial','Cible':'target','Expérimental':'experimental','Gate':'gate','Préparé':'prepared'}[s]);
const detailEl=document.querySelector('#pipelineDetail');
function showPipeline(i){document.querySelectorAll('.pipe-step').forEach((el,n)=>el.classList.toggle('active',n===i));const p=pipeline[i];detailEl.innerHTML=`<div class="detail-icon"><svg><use href="#${p.icon}"/></svg></div><div><strong>${String(i+1).padStart(2,'0')} · ${p.title}</strong><p>${p.text}</p></div><small>${p.limit}</small>`;}
document.querySelectorAll('.pipe-step').forEach((button,i)=>button.addEventListener('click',()=>showPipeline(i)));showPipeline(0);
const statuses=['Tous','Livré','Partiel','Préparé','Cible','Expérimental','Gate'];let active='Tous';
const filterEl=document.querySelector('#filters');
statuses.forEach(s=>{const b=document.createElement('button');b.className='filter'+(s==='Tous'?' active':'');b.textContent=s;b.addEventListener('click',()=>{active=s;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderTools()});filterEl.append(b)});
function renderTools(){const q=document.querySelector('#toolSearch').value.trim().toLocaleLowerCase('fr');const list=tools.map((tool,index)=>({tool,index})).filter(({tool:t})=>(active==='Tous'||t[2]===active)&&t.join(' ').toLocaleLowerCase('fr').includes(q));document.querySelector('#resultCount').textContent=`${list.length} brique${list.length>1?'s':''} affichée${list.length>1?'s':''} · ordre séquentiel conservé`;const grid=document.querySelector('#toolGrid');grid.replaceChildren();list.forEach(({tool:t,index})=>{const a=document.createElement('article');a.className='tool-card';a.innerHTML=`<div class="tool-sequence"><b>${String(index+1).padStart(2,'0')}</b><span>${t[5]}</span></div><div class="tool-top"><div><h3>${t[0]}</h3><span class="version-number">${t[1]}</span></div><span class="status ${statusClass(t[2])}">${t[2].toUpperCase()}</span></div><p>${t[3]}</p><button type="button" aria-expanded="false">Voir la limite <span>＋</span></button><p class="tool-limit">${t[4]}</p>`;a.querySelector('button').addEventListener('click',e=>{const open=a.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))});grid.append(a)});}
document.querySelector('#toolSearch').addEventListener('input',renderTools);renderTools();
const ladder=document.querySelector('#proofLadder');proofs.forEach((p,i)=>{const a=document.createElement('article');a.className='proof-level';a.style.setProperty('--height',`${175+i*24}px`);a.innerHTML=`<b>${p[0]}</b><strong>${p[1]}</strong><p>${p[2]}</p><small>Preuve ${p[3]}</small>`;ladder.append(a)});
const sections=[...document.querySelectorAll('main section[id]')];const links=[...document.querySelectorAll('.topbar nav a')];const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash===`#${e.target.id}`))})},{rootMargin:'-35% 0px -55%'});sections.forEach(s=>observer.observe(s));
