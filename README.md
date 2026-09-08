# Mozzeno Document Trust — aperçu d’architecture

Page HTML interactive et autonome présentant l’architecture décrite dans
`docs/ARCHITECTURE_PIPELINE_OUTILS.md`, `docs/STATUS.md` et
`docs/MULTILAYER_DOCUMENT_TRUST_STRATEGY.md` du dépôt principal Mozzeno.

**État représenté :** M1.4 local synthétique, moteur/policy
`document-forensics.v1.5.0`, audit du 8 septembre 2026.

## Ouvrir localement

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

Le site n’utilise aucune dépendance, aucun service externe et aucun accès réseau.

## Périmètre

- pipeline réellement exécuté ;
- matrice interactive de 52 scénarios de fraude, modification et contournement ;
- distinction entre contrôle ciblé actif, couverture partielle, contrôle à ajouter et
  vérification externe ;
- catalogue filtrable des briques et de leurs limites ;
- architecture danger-first et multilayer L0 à L9 ;
- niveaux de preuve pour la navigation guidée ;
- garde-fous de lecture responsable.

La page est un support de compréhension. Elle ne constitue ni une certification de
production ni une documentation contractuelle. Elle n’héberge aucun backend, ne reçoit
aucun document et ne permet pas de tester la console FastAPI.

La taxonomie est ouverte et versionnée : elle ne promet pas de couvrir toutes les
attaques futures. Un contrôle « actif ciblé » signifie qu’une trace technique précise
est testée localement sur fixtures synthétiques, jamais que la fraude ou l’authenticité
est automatiquement établie.
