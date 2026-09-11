# Remote branch cleanup (run when ready)

Local archive branches already created:

- `archive/master-squash-46`
- `archive/nsimin`
- `archive/djandric`
- `main` (active)

To delete noise remotes on the fork after review:

```bash
# keep: main, archive/*, master (until default branch switched)
git push origin --delete develop frontend config images \
  feature-login feature-registration feature-loyalty \
  feature-boatowner-boats feature-add-new-bungalow \
  nsimin djandric
# ...and the other feature-*/fix-* remotes
```

Do not delete `master` until GitHub default branch is set to `main`.
