# Webpack project template - No framework

---

## Supported technologies:
- `Webpack`
- `TypeScript`
- `SASS`

## Modes:
1. ### development
   | `npm run dev`
    - `webpack-dev-sever`
    - `eslint`
    - maps for ts and css files

2. ### production
    | `npm run build`

    - minification of `JS`, `CSS`, and `HTML` 
    - contenthash as a part of files' names
    - modules' sizes analyzing by `webpack-bundle-analyzer` (`npm run stats`)
    
## Notes
- styles are necessarily imported into `index.ts` (`entry` point in webpack)
- No `babel` (only modern browsers support)
- See `webpack.config.js` comments for more info