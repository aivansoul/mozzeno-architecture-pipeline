const coverageMeta = {
  active: {
    label: 'ACTIF CIBLÉ',
    summary: 'Contrôles actifs ciblés',
    description: 'La trace précise est contrôlée localement et testée sur données synthétiques.',
  },
  partial: {
    label: 'PARTIEL',
    summary: 'Couvertures partielles',
    description: 'Certains sous-cas sont observés, mais la famille reste contournable.',
  },
  missing: {
    label: 'À AJOUTER',
    summary: 'Contrôles à ajouter',
    description: 'Aucun détecteur opérationnel ne recherche encore ce phénomène.',
  },
  external: {
    label: 'SOURCE EXTERNE',
    summary: 'Vérifications externes',
    description: 'Le fichier seul ne peut pas répondre : une source, une identité ou un capteur est requis.',
  },
};

const referenceCatalog = {
  audit: {
    region: 'Mozzeno',
    label: 'Audit technique Document Trust M1.4',
    href: '#target',
  },
  c2pa: {
    region: 'International',
    label: 'Spécifications C2PA — Content Credentials',
    href: 'https://spec.c2pa.org/specifications/specifications/2.4/index.html',
  },
  nistMedia: {
    region: 'US',
    label: 'NIST AI 100-4 — transparence des contenus synthétiques',
    href: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-4.pdf',
  },
  nistIdentity: {
    region: 'US',
    label: 'NIST SP 800-63A-4 — preuve et validation de l’identité',
    href: 'https://pages.nist.gov/800-63-4/sp800-63a.html',
  },
  nistAdversarial: {
    region: 'US',
    label: 'NIST AI 100-2e2025 — attaques et mitigations adversariales',
    href: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2025.pdf',
  },
  eidas: {
    region: 'UE',
    label: 'Commission européenne — validation des signatures électroniques',
    href: 'https://ec.europa.eu/digital-building-blocks/sites/display/DIGITAL/Digital+Signature+Service+-++DSS',
  },
  euShadow: {
    region: 'UE',
    label: 'EU DSS — modifications PDF et attaques « shadow »',
    href: 'https://ec.europa.eu/digital-building-blocks/DSS/webapp-demo/doc/dss-documentation.html',
  },
  ebaRemote: {
    region: 'UE',
    label: 'EBA/GL/2022/15 — onboarding client à distance',
    href: 'https://www.eba.europa.eu/sites/default/files/document_library/Publications/Guidelines/2022/EBA-GL-2022-15%20GL%20on%20remote%20customer%20onboarding/1043884/Guidelines%20on%20the%20use%20of%20Remote%20Customer%20Onboarding%20Solutions.pdf',
  },
  chinaLabel: {
    region: 'Chine',
    label: 'GB 45438-2025 — marquage des contenus synthétiques',
    href: 'https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=F32EA2A561F1886CD8D606513512D547',
  },
  openaiProvenance: {
    region: 'US',
    label: 'OpenAI — Content Credentials et provenance des images',
    href: 'https://openai.com/index/advancing-content-provenance/',
  },
  owasp: {
    region: 'International',
    label: 'OWASP — sécurisation des téléversements de fichiers',
    href: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html',
  },
};

const fraudRisks = [
  {
    id: 'c2pa-ai-verified',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'proof',
    status: 'active',
    priority: 'P0',
    title: 'Création ou édition IA déclarée par C2PA',
    attack: 'Un contenu est créé ou modifié par un système génératif et conserve un manifeste Content Credentials lié aux octets.',
    current: 'M1.4 distingue AI_CREATED et AI_EDITED lorsque le manifeste, la signature et une ancre locale approuvée convergent, y compris sur certains JPEG incorporés.',
    gap: 'La preuve dépend d’un manifeste présent. Les profils de confiance réels des fournisseurs et la révocation de production ne sont pas encore livrés.',
    next: 'Gouverner les signataires, versionner les trust profiles et ajouter révocation contrôlée et seconde validation.',
    layers: 'L1 · L9',
    refs: ['c2pa', 'nistMedia'],
  },
  {
    id: 'c2pa-invalid',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'proof',
    status: 'active',
    priority: 'P0',
    title: 'Manifeste C2PA altéré ou invalide',
    attack: 'Les pixels ou les octets sont modifiés après la signature de provenance, ou le manifeste est incohérent.',
    current: 'Le worker C2PA réel retourne INVALID. Un test signe une image, modifie effectivement ses pixels puis vérifie que la rupture est détectée.',
    gap: 'Le subprocess est borné mais pas encore enfermé dans une sandbox OS de production ; OCSP frais est désactivé.',
    next: 'Worker isolé sans egress, quotas OS, matériaux de confiance versionnés et validation secondaire.',
    layers: 'L1 · L0',
    refs: ['c2pa', 'audit'],
  },
  {
    id: 'ai-declared-metadata',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'observability',
    status: 'partial',
    priority: 'P0',
    title: 'Nom d’outil IA ou workflow génératif déclaré',
    attack: 'Le fichier conserve un nom comme OpenAI ou un workflow A1111, ComfyUI ou Stable Diffusion dans ses métadonnées.',
    current: 'Un vocabulaire fermé relève les fournisseurs, combinaisons de workflow et mentions explicites de contenu synthétique. Le signal apparaît en vigilance.',
    gap: 'Ces champs sont auto-déclarés, supprimables et copiables. Ils n’attribuent jamais cryptographiquement l’auteur ou l’outil.',
    next: 'Ajouter ExifTool isolé, enrichir le vocabulaire sous gouvernance et toujours recouper avec une preuve indépendante.',
    layers: 'L1 · L3',
    refs: ['nistMedia', 'audit'],
  },
  {
    id: 'ai-no-provenance',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'compute',
    status: 'missing',
    priority: 'P0',
    title: 'Image ou document IA sans provenance',
    attack: 'Le contenu généré est exporté, aplati ou recompressé sans C2PA ni métadonnée exploitable.',
    current: 'Aucun classifieur pixel n’est actif. L’absence de trace IA reste correctement neutre et ne produit pas de badge d’authenticité.',
    gap: 'Il n’existe pas de détecteur universel capable d’attribuer avec certitude des pixels à GPT ou à un autre modèle.',
    next: 'Construire une V2 propriétaire multi-branche RGB, fréquence et layout, calibrée par canal, avec OOD et corroboration.',
    layers: 'L4 · L5 · L9',
    refs: ['nistMedia', 'c2pa'],
  },
  {
    id: 'provider-watermark',
    family: 'IA & provenance',
    channel: 'Image/raster',
    icon: 'observability',
    status: 'missing',
    priority: 'P1',
    title: 'Watermark invisible ou empreinte fournisseur',
    attack: 'Un générateur insère un marquage propriétaire invisible ou celui-ci est retiré lors d’une transformation.',
    current: 'Aucun validateur SynthID ou watermark fournisseur n’est branché.',
    gap: 'Chaque watermark dépend du fournisseur, du format et de la version ; son absence ne prouve pas une origine humaine.',
    next: 'Créer des adapters officiels versionnés lorsque les API, licences, taux d’erreur et conditions d’usage le permettent.',
    layers: 'L1 · L4',
    refs: ['nistMedia'],
  },
  {
    id: 'clean-synthetic-document',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'Document entièrement synthétique mais propre',
    attack: 'Une fausse fiche de paie ou un faux relevé est reconstruit de zéro avec une mise en page cohérente et aucune trace déclarative.',
    current: 'Le moteur peut rencontrer un signal accidentel, mais aucun contrôle fiable ne reconnaît aujourd’hui le faux document complet.',
    gap: 'Pas encore d’OCR métier, de profil émetteur versionné ni de confirmation à la source.',
    next: 'Combiner OCR/layout, règles documentaires, registre d’émetteurs et connecteur officiel.',
    layers: 'L5 · L6 · L1',
    refs: ['nistIdentity', 'audit'],
  },
  {
    id: 'native-text-overlay',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'compute',
    status: 'active',
    priority: 'P0',
    title: 'Deux textes peints au même emplacement',
    attack: 'Un montant, un nom ou une date est recouvert par un nouveau texte natif dans la même zone.',
    current: 'pdf.text_overlay.v1 localise la page et la bounding box sans exporter la valeur sensible.',
    gap: 'Un formulaire légitime, un tampon ou un export particulier peut produire la même trace ; un PDF aplati la supprime.',
    next: 'Comparer la couche native au rendu OCR et au profil temporel du document.',
    layers: 'L3 · L5',
    refs: ['audit', 'euShadow'],
  },
  {
    id: 'font-outlier',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'compute',
    status: 'partial',
    priority: 'P1',
    title: 'Rupture locale de police ou de glyphe',
    attack: 'Une valeur remplacée utilise une police, une famille ou une géométrie différente du reste de la zone.',
    current: 'Le moteur relève une police très locale et renforce le signal lorsqu’elle coïncide avec un conflit de position.',
    gap: 'Une police rare peut être légitime et une reconstruction soignée peut reproduire exactement la typographie.',
    next: 'Versionner les profils de templates par émetteur et recouper avec OCR/rendu.',
    layers: 'L3 · L6',
    refs: ['audit'],
  },
  {
    id: 'post-raster-overlay',
    family: 'PDF natif',
    channel: 'PDF image-only',
    icon: 'compute',
    status: 'active',
    priority: 'P0',
    title: 'Graphique ou tampon peint après le raster',
    attack: 'Une image, forme, signature ou zone opaque est ajoutée au-dessus d’un fond couvrant l’essentiel de la page.',
    current: 'pdf.post_raster_graphic_overlay.v1 analyse l’ordre de peinture et fournit une localisation.',
    gap: 'La trace disparaît si le résultat final est aplati dans une seule image ; elle ne prouve pas l’intention.',
    next: 'Ajouter forensique CV spatial, comparaison de référence et preuve source.',
    layers: 'L3 · L4',
    refs: ['audit'],
  },
  {
    id: 'clean-pdf-rewrite',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'knowledge',
    status: 'partial',
    priority: 'P0',
    title: 'Réécriture propre ou reconstruction du PDF',
    attack: 'Le document est régénéré entièrement pour éliminer overlays, historique et incohérences faciles à mesurer.',
    current: 'Des révisions, métadonnées, polices ou géométries atypiques peuvent subsister, sans garantie.',
    gap: 'Un fichier proprement reconstruit peut ne laisser aucune trace locale exploitable.',
    next: 'OCR/layout, profil d’émetteur versionné et contrôle direct à la source.',
    layers: 'L3 · L5 · L6 · L1',
    refs: ['euShadow', 'nistIdentity'],
  },
  {
    id: 'rasterized-document',
    family: 'PDF natif',
    channel: 'PDF ou image',
    icon: 'access',
    status: 'partial',
    priority: 'P0',
    title: 'Screenshot, scan, print-to-PDF ou PDF aplati',
    attack: 'Le fichier natif est remplacé par une représentation raster qui efface structure, historique et signature exploitable.',
    current: 'Le moteur reconnaît RASTER_INPUT, IMAGE_ONLY_PDF ou MIXED et demande l’original au lieu de déclarer le fichier sain.',
    gap: 'Il ne distingue pas encore scan, capture d’écran et export, ni la retouche cachée dans les pixels.',
    next: 'OCR/CV par canal, parcours source instrumenté ou API officielle.',
    layers: 'L3 · L4 · L8',
    refs: ['audit', 'nistMedia'],
  },
  {
    id: 'incremental-update',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'proof',
    status: 'partial',
    priority: 'P1',
    title: 'Mise à jour incrémentale du PDF',
    attack: 'De nouveaux objets ou une nouvelle révision sont ajoutés sans réécrire tout le fichier.',
    current: 'Le moteur compte des marqueurs de révision et les croise avec la couverture cryptographique éventuelle.',
    gap: 'Signature, annotation, formulaire et horodatage légitimes emploient aussi ce mécanisme.',
    next: 'Ajouter qpdf et veraPDF isolés, puis une comparaison de versions orientée objets.',
    layers: 'L2 · L3',
    refs: ['euShadow', 'audit'],
  },
  {
    id: 'page-insertion-removal',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'compute',
    status: 'partial',
    priority: 'P1',
    title: 'Page ajoutée, retirée ou réordonnée',
    attack: 'Une page compromettante est supprimée, une annexe est insérée ou l’ordre est changé.',
    current: 'Le changement peut être visible si une signature antérieure ne couvre plus le fichier ou si une révision subsiste.',
    gap: 'Sans original, signature ou référence, l’ordre et le nombre de pages reçus ne prouvent rien.',
    next: 'OCR des numéros/totaux et comparaison avec version ou source officielle.',
    layers: 'L2 · L3 · L5',
    refs: ['euShadow', 'audit'],
  },
  {
    id: 'visible-hidden-text-divergence',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'Texte caché différent des pixels visibles',
    attack: 'La couche texte utilisée par extraction ou automatisation raconte autre chose que le rendu montré à l’analyste.',
    current: 'Les spans invisibles sont comptés, mais aucun OCR du rendu ne les réconcilie.',
    gap: 'Pas de comparaison systématique PDF natif ↔ rendu visible.',
    next: 'OCR local sur chaque page et règles de divergence spatiale/lexicale.',
    layers: 'L3 · L5',
    refs: ['euShadow'],
  },
  {
    id: 'pixel-copy-move',
    family: 'Images & pixels',
    channel: 'Image/raster',
    icon: 'observability',
    status: 'missing',
    priority: 'P0',
    title: 'Copy-move, collage ou splicing',
    attack: 'Une zone est copiée, déplacée ou prélevée d’une autre image pour remplacer un montant, une identité ou un logo.',
    current: 'Aucun algorithme ou modèle actif ne recherche ces traces. Le sidecar visuel retourne MODEL_NOT_INSTALLED.',
    gap: 'Format, pHash et dimensions ne localisent pas une manipulation.',
    next: 'OpenCV en shadow et modèle de localisation propriétaire, évalués à faux positifs constants.',
    layers: 'L4 · L9',
    refs: ['nistMedia', 'audit'],
  },
  {
    id: 'pixel-inpainting',
    family: 'Images & pixels',
    channel: 'Image/raster',
    icon: 'observability',
    status: 'missing',
    priority: 'P0',
    title: 'Inpainting, generative fill ou suppression d’objet',
    attack: 'Une IA reconstitue localement le fond après avoir effacé ou remplacé une information.',
    current: 'Aucun poids ou classifieur pixel n’est installé dans le produit.',
    gap: 'Une retouche bien reconstruite peut effacer les frontières et métadonnées simples.',
    next: 'Architecture propriétaire de localisation, tête OOD et recoupement OCR/source.',
    layers: 'L4 · L5 · L9',
    refs: ['nistMedia'],
  },
  {
    id: 'identity-image-morph',
    family: 'Images & pixels',
    channel: 'Image/raster',
    icon: 'observability',
    status: 'missing',
    priority: 'P1',
    title: 'Photo remplacée, morphing ou deepfake d’identité',
    attack: 'Le portrait d’un document ou d’une capture est remplacé ou fusionné avec une autre identité.',
    current: 'Document Trust n’active aucun contrôle facial ou biométrique.',
    gap: 'Une analyse d’identité exige capture contrôlée, références et gouvernance biométrique dédiée.',
    next: 'Module KYC distinct : liveness, NFC ou source autoritative, avec DPIA et consentement adaptés.',
    layers: 'Hors fichier · L1',
    refs: ['nistIdentity', 'nistMedia'],
  },
  {
    id: 'jpeg-resampling-noise',
    family: 'Images & pixels',
    channel: 'Image/raster',
    icon: 'compute',
    status: 'missing',
    priority: 'P1',
    title: 'Double JPEG, resampling ou bruit incohérent',
    attack: 'La recompression, le redimensionnement ou le bruit servent à masquer une zone modifiée ou l’historique d’édition.',
    current: 'Format, dimensions et quelques faits JPEG sont inventoriés, sans décision forensique active.',
    gap: 'ELA et artefacts de compression sont faibles, dépendants du canal et faciles à surinterpréter.',
    next: 'Détecteurs déterministes OpenCV en shadow ; ELA uniquement sur JPEG natif, jamais sur rendu PDF ou PNG.',
    layers: 'L4',
    refs: ['nistMedia', 'audit'],
  },
  {
    id: 'metadata-tampering',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'proof',
    status: 'partial',
    priority: 'P1',
    title: 'Métadonnées supprimées, nettoyées ou falsifiées',
    attack: 'Créateur, logiciel, dates, EXIF ou XMP sont effacés ou remplacés pour brouiller l’origine.',
    current: 'Le moteur observe certaines présences et valeurs fermées, et sépare toujours déclaration de vérification.',
    gap: 'Une absence est neutre et une métadonnée non signée reste modifiable.',
    next: 'ExifTool isolé, profils de tags minimisés et cohérence croisée avec structure et source.',
    layers: 'L1 · L3',
    refs: ['c2pa', 'nistMedia'],
  },
  {
    id: 'signature-integrity-broken',
    family: 'Signatures',
    channel: 'PDF natif',
    icon: 'proof',
    status: 'active',
    priority: 'P0',
    title: 'Intégrité cryptographique PDF rompue',
    attack: 'Les octets couverts par une signature CMS/PDF sont modifiés ou la signature ne se vérifie plus.',
    current: 'signature.cryptographic_integrity_failed.v1 produit un fait critique et impose la revue.',
    gap: 'La rupture ne détermine ni l’auteur ni l’intention et peut aussi signaler une corruption.',
    next: 'Conserver la détection et compléter par chaîne de confiance et révocation.',
    layers: 'L2 · L9',
    refs: ['eidas', 'audit'],
  },
  {
    id: 'post-signature-revision',
    family: 'Signatures',
    channel: 'PDF natif',
    icon: 'proof',
    status: 'active',
    priority: 'P0',
    title: 'Révision postérieure aux octets signés',
    attack: 'Le fichier courant contient des changements après la version couverte par la signature.',
    current: 'signature.post_signature_revision.v1 distingue signature intacte et fichier courant plus récent.',
    gap: 'Cosignature, annotation et horodatage peuvent être légitimes ; les permissions détaillées ne sont pas toutes interprétées.',
    next: 'Analyser DocMDP/FieldMDP et classifier les changements autorisés.',
    layers: 'L2 · L3',
    refs: ['eidas', 'euShadow'],
  },
  {
    id: 'untrusted-certificate',
    family: 'Signatures',
    channel: 'PDF natif',
    icon: 'proof',
    status: 'partial',
    priority: 'P0',
    title: 'Certificat non fiable, expiré ou révoqué',
    attack: 'Une signature intacte utilise un certificat inadéquat, compromis ou non reconnu pour l’émetteur.',
    current: 'pyHanko contrôle l’intégrité locale ; le rapport affiche explicitement que la confiance n’est pas évaluée.',
    gap: 'Aucune Trusted List, politique eIDAS, CRL/OCSP ou qualification de signataire de production.',
    next: 'Sidecar DSS de la Commission européenne et matériaux de confiance gouvernés.',
    layers: 'L2 · L6',
    refs: ['eidas'],
  },
  {
    id: 'visual-signature-copy',
    family: 'Signatures',
    channel: 'PDF ou image',
    icon: 'proof',
    status: 'partial',
    priority: 'P0',
    title: 'Signature manuscrite, tampon ou sceau copié',
    attack: 'Une image de signature ou un tampon est collé dans une zone qui semble signée.',
    current: 'Le moteur repère un graphique chevauchant certains widgets /Sig non signés et certaines surcouches post-raster.',
    gap: 'Sans widget ou après aplatissement, le contrôle est contourné ; aucune biométrie de signature n’est active.',
    next: 'CV localisé, référence d’émetteur et revue humaine sans prétendre identifier le signataire.',
    layers: 'L2 · L3 · L4',
    refs: ['eidas', 'audit'],
  },
  {
    id: 'qr-iban-replacement',
    family: 'Contenu & références',
    channel: 'PDF ou image',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'QR, barcode ou IBAN remplacé',
    attack: 'Un code de paiement ou un compte bénéficiaire est substitué tout en conservant un document visuellement plausible.',
    current: 'Aucun décodage QR/barcode ni checksum métier n’est actif.',
    gap: 'L’analyse graphique seule ne confirme pas le bénéficiaire attendu.',
    next: 'Décodeur isolé, checksum IBAN, règles de concordance dossier et source autorisée.',
    layers: 'L5 · L7 · L1',
    refs: ['nistIdentity'],
  },
  {
    id: 'semantic-inconsistency',
    family: 'Contenu & références',
    channel: 'PDF ou image',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'Montant, salaire, date ou calcul incohérent',
    attack: 'Une valeur est modifiée sans réconcilier total, période, cotisations, solde ou identité employeur.',
    current: 'La couverture semantic_reconciliation reste NOT_IMPLEMENTED.',
    gap: 'Aucun OCR de production, champ typé ou moteur arithmétique ne vérifie actuellement la vérité métier.',
    next: 'OCR local, schémas par type documentaire et règles déterministes — jamais un calcul LLM faisant foi.',
    layers: 'L5 · L6',
    refs: ['nistIdentity', 'audit'],
  },
  {
    id: 'forged-template',
    family: 'Contenu & références',
    channel: 'PDF ou image',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'Faux logo, sceau, émetteur ou template',
    attack: 'Un document entièrement contrefait imite une banque, un employeur ou une administration et reste cohérent avec lui-même.',
    current: 'issuer_reference_profile vaut NOT_AVAILABLE ; aucun registre de templates n’est interrogé.',
    gap: 'Les seules heuristiques locales ne connaissent ni les versions officielles ni leurs périodes de validité.',
    next: 'Registre temporel d’émetteurs, clés, certificats et templates, avec owner et taux de faux positifs.',
    layers: 'L6 · L1',
    refs: ['nistIdentity'],
  },
  {
    id: 'exact-reuse',
    family: 'Séries & réemploi',
    channel: 'Dossier',
    icon: 'decision',
    status: 'active',
    priority: 'P1',
    title: 'Réemploi du fichier strictement identique',
    attack: 'Le même fichier est soumis plusieurs fois dans un contexte potentiellement différent.',
    current: 'Le SHA-256 est recherché dans les soumissions non supprimées et produit serial.exact_duplicate.v1.',
    gap: 'Un doublon peut être légitime et le contrôle actuel n’établit pas l’identité ou l’intention.',
    next: 'Ajouter portée tenant/dossier, fenêtre temporelle et règles de contexte.',
    layers: 'L0 · L7',
    refs: ['audit'],
  },
  {
    id: 'near-duplicate',
    family: 'Séries & réemploi',
    channel: 'Dossier',
    icon: 'decision',
    status: 'missing',
    priority: 'P0',
    title: 'Quasi-doublon légèrement modifié',
    attack: 'Nom, montant, compression ou page change juste assez pour produire un nouveau hash.',
    current: 'Un pHash de la première miniature est stocké, mais aucun index ni seuil ne le compare.',
    gap: 'Le pHash seul peut manquer une petite modification matérielle ou créer des collisions.',
    next: 'Index pHash, layout hash et embeddings approuvés, calibrés et limités par finalité.',
    layers: 'L4 · L7',
    refs: ['audit'],
  },
  {
    id: 'stolen-authentic-document',
    family: 'Séries & réemploi',
    channel: 'Dossier',
    icon: 'decision',
    status: 'partial',
    priority: 'P0',
    title: 'Document authentique volé ou réutilisé',
    attack: 'Un vrai document appartenant à une autre personne ou à une autre demande est présenté hors de son contexte.',
    current: 'Il est retrouvé seulement s’il est octet-pour-octet identique à une soumission connue.',
    gap: 'Aucun lien d’identité, de tenant, de période ou de source ne ferme actuellement le contexte.',
    next: 'Index cross-dossier gouverné, pseudonymisation et contrôle d’identité/source distinct.',
    layers: 'L7 · L1',
    refs: ['nistIdentity', 'audit'],
  },
  {
    id: 'official-source-check',
    family: 'Source & navigation',
    channel: 'Source externe',
    icon: 'access',
    status: 'missing',
    priority: 'P0',
    title: 'Absence de vérification auprès de l’émetteur',
    attack: 'Un faux fichier est conçu pour être indiscernable localement, mais ne correspond à aucune donnée de la banque, de l’employeur ou du service public.',
    current: 'source_verification vaut NOT_AVAILABLE ; aucun connecteur officiel n’est actif.',
    gap: 'L’analyse d’un fichier isolé ne peut pas reconstituer une donnée que l’émetteur n’a jamais produite.',
    next: 'API/connecteur officiel avec consentement, minimisation et preuve de réponse ; open banking lorsque pertinent.',
    layers: 'L1 · L6',
    refs: ['nistIdentity'],
  },
  {
    id: 'guided-observation',
    family: 'Source & navigation',
    channel: 'Session',
    icon: 'access',
    status: 'partial',
    priority: 'P1',
    title: 'Parcours guidé sans attestation de source',
    attack: 'Une capture difficile à télécharger est montrée à distance, mais la simple continuité visuelle peut être simulée.',
    current: 'Le pilote N1 local gère consentement, partage d’onglet ou fenêtre, jalons, captures, vidéo et manifeste hashé.',
    gap: 'Le portail est synthétique et local ; les pixels observés ne prouvent ni domaine, ni identité, ni vérité.',
    next: 'N2/N3 : navigateur géré, origine TLS, nonce, continuité, IAM et paquet de provenance signé.',
    layers: 'L8 · L0',
    refs: ['nistIdentity', 'audit'],
  },
  {
    id: 'session-replay',
    family: 'Source & navigation',
    channel: 'Session',
    icon: 'access',
    status: 'missing',
    priority: 'P0',
    title: 'Faux portail, replay ou deepfake d’écran',
    attack: 'Une vidéo préenregistrée, un flux figé, une page clonée ou un écran synthétique imite une session authentique.',
    current: 'Les événements reçus sont hashés après réception, sans prouver qu’ils étaient vrais à l’origine.',
    gap: 'Aucune attestation de domaine, challenge dynamique ou détection de flux virtuel n’est active.',
    next: 'Attestation d’origine, challenges nonces, anti-replay, instrumentation navigateur et connecteur source.',
    layers: 'L8 · L1',
    refs: ['nistIdentity', 'nistMedia'],
  },
  {
    id: 'mime-spoof',
    family: 'Sécurité & hors fichier',
    channel: 'Conteneur',
    icon: 'access',
    status: 'active',
    priority: 'P0',
    title: 'MIME usurpé ou faux préfixe PDF',
    attack: 'L’extension et le Content-Type cachent un autre format, ou des octets précèdent illicitement %PDF.',
    current: 'Magic bytes, concordance MIME et contrôle de préfixe rejettent les cas testés avant persistance du contenu.',
    gap: 'Ce contrôle n’est pas une détection universelle des polyglottes ou comportements divergents entre lecteurs.',
    next: 'Second parseur qpdf, inventaire des contenus actifs, antivirus évalué et sandbox.',
    layers: 'L0',
    refs: ['owasp', 'audit'],
  },
  {
    id: 'hostile-pdf',
    family: 'Sécurité & hors fichier',
    channel: 'Conteneur',
    icon: 'access',
    status: 'partial',
    priority: 'P0',
    title: 'PDF chiffré, malformé ou bombe de décompression',
    attack: 'Le fichier cherche à épuiser CPU/mémoire, exploiter un parseur ou masquer des actions, pièces jointes ou JavaScript.',
    current: 'Quotas, parsing borné, refus/abstention et aperçu rasterisé réduisent certains risques.',
    gap: 'Pas encore de sandbox parseur, kill dur généralisé, antivirus ou inventaire complet des contenus actifs.',
    next: 'Workers non privilégiés, filesystem read-only, egress off, limites OS et AV si validé.',
    layers: 'L0',
    refs: ['owasp', 'audit'],
  },
  {
    id: 'physical-security-features',
    family: 'Sécurité & hors fichier',
    channel: 'Monde physique',
    icon: 'proof',
    status: 'external',
    priority: 'P2',
    title: 'Hologramme, UV, filigrane ou puce NFC physique',
    attack: 'Un document papier ou d’identité contrefait imite des éléments invisibles dans un PDF ou screenshot standard.',
    current: 'Ces propriétés ne sont pas observables depuis le canal documentaire actuel.',
    gap: 'Un pixel téléchargé ne contient ni réponse NFC, ni réaction UV, ni acquisition sécurisée du support.',
    next: 'Parcours document physique séparé avec capteur et protocole d’acquisition qualifiés.',
    layers: 'Hors périmètre fichier',
    refs: ['nistIdentity'],
  },
  {
    id: 'holder-identity',
    family: 'Sécurité & hors fichier',
    channel: 'Identité',
    icon: 'decision',
    status: 'external',
    priority: 'P0',
    title: 'Identité du porteur ou propriété du compte',
    attack: 'Un vrai document est présenté par la mauvaise personne ou depuis un compte compromis.',
    current: 'Document Trust ne réalise ni biométrie, ni liveness, ni authentification client.',
    gap: 'L’authenticité du fichier et l’identité du porteur sont deux preuves différentes.',
    next: 'KYC/liveness/IAM distinct, légalement gouverné et relié au dossier par des identifiants minimisés.',
    layers: 'Système externe · L7',
    refs: ['nistIdentity'],
  },
  {
    id: 'fresh-business-truth',
    family: 'Sécurité & hors fichier',
    channel: 'Source externe',
    icon: 'knowledge',
    status: 'external',
    priority: 'P0',
    title: 'Document officiel mais situation devenue fausse',
    attack: 'Le fichier est authentique, mais l’emploi, le revenu, le solde ou l’autorisation ont changé depuis son émission.',
    current: 'L’intégrité et la provenance du fichier ne confirment pas la fraîcheur de la situation métier.',
    gap: 'La vérité actuelle réside chez l’émetteur ou dans un système autoritatif.',
    next: 'Vérification à la source, fenêtre de fraîcheur et règles métier approuvées.',
    layers: 'L1 · L6',
    refs: ['nistIdentity'],
  },
  {
    id: 'fraud-legal-decision',
    family: 'Sécurité & hors fichier',
    channel: 'Décision',
    icon: 'decision',
    status: 'external',
    priority: 'P0',
    title: 'Qualification juridique de fraude ou refus de crédit',
    attack: 'Un signal technique est utilisé comme raccourci pour conclure à une fraude ou prendre une décision automatisée.',
    current: 'La policy ne fait que rejeter une entrée invalide, demander une meilleure preuve ou router vers la revue humaine.',
    gap: 'Aucun signal isolé ne porte l’intention, le contexte juridique ou la décision crédit.',
    next: 'Décision humaine significative, processus crédit séparé et piste d’audit contestable.',
    layers: 'L9 · Système crédit',
    refs: ['nistIdentity', 'audit'],
  },
  {
    id: 'llm-text-in-real-template',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'Texte ou chiffres inventés par LLM dans un vrai template',
    attack: 'Un utilisateur conserve le visuel d’un document réel mais remplace les données par un contenu rédigé ou calculé avec une IA.',
    current: 'Aucune trace technique obligatoire ne relie un texte copié-collé au modèle qui l’a produit.',
    gap: 'Un détecteur de style linguistique serait trop fragile et ne prouverait ni le fournisseur ni la fausseté des valeurs.',
    next: 'Contrôle déterministe des champs, rapprochement interdocuments et vérification auprès de l’émetteur.',
    layers: 'L5 · L6 · L1',
    refs: ['nistMedia', 'nistIdentity'],
  },
  {
    id: 'c2pa-stripped',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'proof',
    status: 'missing',
    priority: 'P0',
    title: 'C2PA retiré par screenshot ou réencodage',
    attack: 'Le contenu conserve son apparence mais perd entièrement son manifeste lors d’une capture, d’un crop ou d’un export.',
    current: 'Le moteur constate seulement qu’aucune provenance prise en charge n’est présente ; il ne baisse jamais le risque pour cette raison.',
    gap: 'Les octets finaux ne permettent pas de prouver qu’un manifeste existait auparavant.',
    next: 'Manifest repository ou vérification provider-side lorsque disponible, plus preuve directe de source.',
    layers: 'L1 · L8',
    refs: ['c2pa', 'openaiProvenance'],
  },
  {
    id: 'c2pa-copied-binding',
    family: 'IA & provenance',
    channel: 'PDF ou image',
    icon: 'proof',
    status: 'active',
    priority: 'P1',
    title: 'Manifeste C2PA copié depuis un autre fichier',
    attack: 'Une credential légitime est transplantée vers des octets différents pour usurper leur provenance.',
    current: 'Le hard binding cryptographique ne correspond plus et le contrôle classe la provenance comme invalide.',
    gap: 'La conclusion porte sur la liaison rompue, pas sur l’identité de l’attaquant ou la vérité métier.',
    next: 'Conserver le fail-closed et corréler avec fournisseur, source et révocation.',
    layers: 'L1',
    refs: ['c2pa'],
  },
  {
    id: 'acroform-change',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'compute',
    status: 'partial',
    priority: 'P0',
    title: 'Champ AcroForm ou apparence modifié',
    attack: 'Une valeur de formulaire, son apparence ou ses permissions change après création ou signature.',
    current: 'Certains widgets /Sig, apparences et révisions sont observés, avec abstention sur les structures ambiguës.',
    gap: 'XFA, Form XObjects récursifs et permissions DocMDP/FieldMDP ne sont pas entièrement évalués.',
    next: 'Analyse de formulaire dédiée, qpdf et validation PAdES/DSS des changements autorisés.',
    layers: 'L2 · L3',
    refs: ['euShadow', 'eidas'],
  },
  {
    id: 'pdf-image-object-replacement',
    family: 'PDF natif',
    channel: 'PDF natif',
    icon: 'compute',
    status: 'missing',
    priority: 'P1',
    title: 'Image, logo ou tableau remplacé dans un XObject',
    attack: 'Une ressource image interne est substituée sans forcément ajouter un nouvel overlay visible dans l’ordre de peinture.',
    current: 'Les ressources et certains JPEG incorporés sont inventoriés, mais aucune référence ne dit quelle image était attendue.',
    gap: 'Sans version antérieure ou profil émetteur, le remplacement peut être structurellement propre.',
    next: 'Empreintes d’objets, comparaison multi-version et profil de ressources par template.',
    layers: 'L3 · L6',
    refs: ['euShadow', 'audit'],
  },
  {
    id: 'ledger-manipulation',
    family: 'Contenu & références',
    channel: 'PDF ou image',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'Transaction ajoutée, supprimée ou réordonnée',
    attack: 'Une ligne bancaire disparaît ou une fausse transaction est insérée en ajustant visuellement le tableau.',
    current: 'Aucun ledger n’est reconstruit depuis le document.',
    gap: 'Sans OCR structuré, les séquences, soldes, reports et paginations ne sont pas recalculés.',
    next: 'Extraction tabulaire locale et reconstruction déterministe des soldes, puis confirmation bancaire.',
    layers: 'L5 · L6 · L1',
    refs: ['nistIdentity'],
  },
  {
    id: 'cross-document-contradiction',
    family: 'Contenu & références',
    channel: 'Dossier',
    icon: 'knowledge',
    status: 'missing',
    priority: 'P0',
    title: 'Contradiction entre documents du même dossier',
    attack: 'Fiche de paie, relevé bancaire et déclaration fiscale portent des noms, dates ou revenus incompatibles.',
    current: 'Les rapports restent document par document ; aucun graphe de faits ne réconcilie le dossier.',
    gap: 'Le doublon binaire ne compare ni entités, ni périodes, ni flux financiers.',
    next: 'Graphe de faits typés, règles temporelles et identifiants pseudonymisés sous finalité autorisée.',
    layers: 'L5 · L7',
    refs: ['nistIdentity'],
  },
  {
    id: 'synthetic-identity',
    family: 'Séries & réemploi',
    channel: 'Identité',
    icon: 'decision',
    status: 'external',
    priority: 'P0',
    title: 'Identité synthétique mêlant données réelles et fictives',
    attack: 'Plusieurs attributs valides sont assemblés pour créer une identité qui n’existe pas ou détourner celle d’un tiers.',
    current: 'Aucune vue réseau ou multi-source n’est active dans Document Trust.',
    gap: 'Un document cohérent isolément ne révèle pas nécessairement la composition identitaire.',
    next: 'Plusieurs sources autoritatives, entity resolution et graph analytics gouvernés hors du verdict documentaire.',
    layers: 'Système identité · L7',
    refs: ['nistIdentity'],
  },
  {
    id: 'qr-false-domain',
    family: 'Contenu & références',
    channel: 'PDF ou image',
    icon: 'access',
    status: 'missing',
    priority: 'P0',
    title: 'QR valide pointant vers un faux domaine',
    attack: 'Le code se décode correctement mais redirige vers un homographe, un intermédiaire ou un domaine non autorisé.',
    current: 'Aucun payload n’est décodé et aucune origine finale n’est contrôlée.',
    gap: 'La validité graphique du QR ne prouve ni le domaine ni la liaison au document.',
    next: 'Décodeur sans navigation automatique, allowlist d’émetteur, résolution de redirection et payload signé.',
    layers: 'L5 · L1',
    refs: ['nistIdentity', 'owasp'],
  },
  {
    id: 'virtual-camera-replay',
    family: 'Source & navigation',
    channel: 'Session',
    icon: 'access',
    status: 'missing',
    priority: 'P0',
    title: 'Virtual camera ou flux vidéo injecté',
    attack: 'Un périphérique logiciel fournit à la session une vidéo préparée plutôt qu’une capture directe du contexte attendu.',
    current: 'Le pilote WebRTC reçoit un flux mais ne possède aucune attestation de capteur ou de device.',
    gap: 'La continuité vidéo seule est reproductible par un appareil virtuel.',
    next: 'Attestation device/capteur, challenges aléatoires et contrôle de continuité de session.',
    layers: 'L8 · Système identité',
    refs: ['ebaRemote', 'nistIdentity'],
  },
  {
    id: 'devtools-overlay',
    family: 'Source & navigation',
    channel: 'Session',
    icon: 'access',
    status: 'missing',
    priority: 'P0',
    title: 'Page officielle modifiée localement par DevTools',
    attack: 'Le domaine est authentique, mais CSS, DOM, extension ou overlay local change ce que voit l’enregistrement.',
    current: 'Le partage d’écran N1 capture des pixels et événements, pas l’intégrité de la page ou de son origine réseau.',
    gap: 'Une URL correcte à l’écran n’atteste pas le DOM, la réponse serveur ou le téléchargement.',
    next: 'Navigateur géré, journal réseau signé et surtout connecteur/API lorsque possible.',
    layers: 'L8 · L1',
    refs: ['ebaRemote', 'nistIdentity'],
  },
  {
    id: 'adversarial-evasion',
    family: 'Sécurité & hors fichier',
    channel: 'PDF ou image',
    icon: 'observability',
    status: 'missing',
    priority: 'P1',
    title: 'Évasion par crop, bruit, flou ou perturbation adversariale',
    attack: 'Des transformations légères sont optimisées pour casser un détecteur, masquer une trace ou déplacer le fichier hors distribution.',
    current: 'Aucune batterie multi-échelle, mesure OOD ou robustesse adversariale n’influence le moteur actuel.',
    gap: 'Un résultat silencieux pourrait être confondu avec une absence d’anomalie si la couverture n’était pas affichée.',
    next: 'Tests par transformation, tête OOD, désaccord de modèles, canary et abstention obligatoire.',
    layers: 'L4 · L9',
    refs: ['nistAdversarial', 'nistMedia'],
  },
  {
    id: 'parser-differential',
    family: 'Sécurité & hors fichier',
    channel: 'PDF natif',
    icon: 'compute',
    status: 'partial',
    priority: 'P0',
    title: 'PDF affiché différemment selon le parseur',
    attack: 'Un fichier ambigu exploite des interprétations divergentes entre analyseur, lecteur, extraction texte et rendu.',
    current: 'pypdf inspecte la structure et PDFium produit un aperçu, mais aucun diff multi-parseurs exhaustif n’est calculé.',
    gap: 'Les contrôles PDF natifs partagent encore une dépendance pypdf et peuvent partager un angle mort.',
    next: 'qpdf, veraPDF, OCR du rendu et policy de désaccord explicite dans des workers séparés.',
    layers: 'L0 · L3 · L5',
    refs: ['euShadow', 'audit'],
  },
  {
    id: 'document-prompt-injection',
    family: 'Sécurité & hors fichier',
    channel: 'PDF ou image',
    icon: 'decision',
    status: 'partial',
    priority: 'P1',
    title: 'Prompt injection cachée contre un futur LLM/VLM',
    attack: 'Le document contient une instruction visible ou invisible destinée à détourner l’agent d’analyse ou lui faire inventer une preuve.',
    current: 'La policy actuelle est déterministe et aucun LLM ne décide. Le contenu du document n’est pas exécuté comme instruction.',
    gap: 'Tout futur OCR agentique, VLM ou multiagent réintroduira cette surface si les contrats et permissions sont trop larges.',
    next: 'Outils typés, données hostiles, sorties fermées, moindre privilège et policy toujours hors LLM.',
    layers: 'L5 · L9',
    refs: ['nistAdversarial', 'audit'],
  },
];

const fraudGrid = document.querySelector('#fraudGrid');
const fraudSummary = document.querySelector('#fraudSummary');
const fraudSearch = document.querySelector('#fraudSearch');
const fraudFamily = document.querySelector('#fraudFamily');
const fraudStatus = document.querySelector('#fraudStatus');
const fraudChannel = document.querySelector('#fraudChannel');
const fraudResultCount = document.querySelector('#fraudResultCount');
const fraudEmpty = document.querySelector('#fraudEmpty');

function uniqueSorted(key) {
  return [...new Set(fraudRisks.map((risk) => risk[key]))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  );
}

function addOptions(select, values) {
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function sourceLinks(keys) {
  return keys
    .map((key) => referenceCatalog[key])
    .filter(Boolean)
    .map(
      (source) =>
        `<a href="${source.href}"${source.href.startsWith('#') ? '' : ' target="_blank" rel="noreferrer"'}>${source.region} · ${source.label}<span aria-hidden="true">↗</span></a>`,
    )
    .join('');
}

function buildThreatCard(risk, index) {
  const card = document.createElement('details');
  card.id = `risk-${risk.id}`;
  card.className = `fraud-card coverage-${risk.status}`;
  card.dataset.family = risk.family;
  card.dataset.status = risk.status;
  card.dataset.channel = risk.channel;
  card.dataset.search = Object.values(risk).join(' ').toLocaleLowerCase('fr');
  card.style.setProperty('--fraud-order', String(index % 8));
  card.innerHTML = `
    <summary>
      <span class="fraud-card-icon"><img src="assets/icon-${risk.icon}.png" alt=""></span>
      <span class="fraud-card-title"><small>${risk.family} · ${risk.channel}</small><strong>${risk.title}</strong></span>
      <span class="fraud-card-meta"><b class="coverage-badge ${risk.status}">${coverageMeta[risk.status].label}</b><i>${risk.priority}</i></span>
      <span class="fraud-chevron" aria-hidden="true">＋</span>
    </summary>
    <div class="fraud-detail">
      <div class="fraud-attack"><span>Mode opératoire</span><p>${risk.attack}</p></div>
      <div class="fraud-now"><span>Ce qui fonctionne aujourd’hui</span><p>${risk.current}</p></div>
      <div class="fraud-gap"><span>Limite actuelle</span><p>${risk.gap}</p></div>
      <div class="fraud-next"><span>Couche suivante</span><p>${risk.next}</p></div>
      <footer><b>${risk.layers}</b><div>${sourceLinks(risk.refs)}</div></footer>
    </div>`;
  return card;
}

function renderSummary() {
  const total = document.createElement('article');
  total.className = 'fraud-summary-card total';
  total.innerHTML = `<strong>${fraudRisks.length}</strong><span>scénarios versionnés</span><small>Taxonomie ouverte : une attaque future peut rester inconnue.</small>`;
  fraudSummary.append(total);

  Object.entries(coverageMeta).forEach(([status, meta]) => {
    const count = fraudRisks.filter((risk) => risk.status === status).length;
    const card = document.createElement('article');
    card.className = `fraud-summary-card ${status}`;
    card.innerHTML = `<strong>${count}</strong><span>${meta.summary}</span><small>${meta.description}</small>`;
    fraudSummary.append(card);
  });
}

function applyThreatFilters() {
  const query = fraudSearch.value.trim().toLocaleLowerCase('fr');
  let visible = 0;
  fraudGrid.querySelectorAll('.fraud-card').forEach((card) => {
    const matches =
      (!query || card.dataset.search.includes(query)) &&
      (fraudFamily.value === 'all' || card.dataset.family === fraudFamily.value) &&
      (fraudStatus.value === 'all' || card.dataset.status === fraudStatus.value) &&
      (fraudChannel.value === 'all' || card.dataset.channel === fraudChannel.value);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  fraudResultCount.textContent = `${visible} scénario${visible > 1 ? 's' : ''} affiché${visible > 1 ? 's' : ''} sur ${fraudRisks.length}`;
  fraudEmpty.hidden = visible !== 0;
}

function resetThreatFilters() {
  fraudSearch.value = '';
  fraudFamily.value = 'all';
  fraudStatus.value = 'all';
  fraudChannel.value = 'all';
  applyThreatFilters();
  fraudSearch.focus({ preventScroll: true });
}

function installFraudMotion(card) {
  const allowsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!allowsMotion || !hasFinePointer) return;
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
    card.style.setProperty('--rx', `${(0.5 - y) * 2.4}deg`);
    card.style.setProperty('--ry', `${(x - 0.5) * 2.4}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
}

addOptions(fraudFamily, uniqueSorted('family'));
Object.entries(coverageMeta).forEach(([value, meta]) => {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = meta.label;
  fraudStatus.append(option);
});
addOptions(fraudChannel, uniqueSorted('channel'));
renderSummary();

fraudRisks.forEach((risk, index) => {
  const card = buildThreatCard(risk, index);
  fraudGrid.append(card);
  installFraudMotion(card);
});

Object.values(referenceCatalog).forEach((source) => {
  const link = document.createElement('a');
  link.href = source.href;
  if (!source.href.startsWith('#')) {
    link.target = '_blank';
    link.rel = 'noreferrer';
  }
  link.innerHTML = `<span>${source.region}</span><strong>${source.label}</strong><i aria-hidden="true">↗</i>`;
  document.querySelector('#fraudSources').append(link);
});

[fraudSearch, fraudFamily, fraudStatus, fraudChannel].forEach((control) =>
  control.addEventListener(control === fraudSearch ? 'input' : 'change', applyThreatFilters),
);
document.querySelector('#fraudReset').addEventListener('click', resetThreatFilters);
fraudEmpty.querySelector('button').addEventListener('click', resetThreatFilters);
document.querySelector('#fraudCollapseAll').addEventListener('click', () => {
  fraudGrid.querySelectorAll('details[open]').forEach((card) => card.removeAttribute('open'));
});
applyThreatFilters();
