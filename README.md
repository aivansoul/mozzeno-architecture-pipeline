# Mozzeno Document Trust — aperçu d’architecture

Page HTML interactive et autonome présentant l’architecture décrite dans
`docs/ARCHITECTURE_PIPELINE_OUTILS.md` du dépôt principal Mozzeno.

## Ouvrir localement

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

Le site n’utilise aucune dépendance, aucun service externe et aucun accès réseau.

## Périmètre

- pipeline réellement exécuté ;
- catalogue filtrable des briques et de leurs limites ;
- architecture cible et priorités ;
- niveaux de preuve pour la navigation guidée ;
- garde-fous de lecture responsable.

La page est un support de compréhension. Elle ne constitue ni une certification de
production ni une documentation contractuelle.
