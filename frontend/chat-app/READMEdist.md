## Created the dist feature to serve it statically
npm i 
npm run build
npm install -D @types/node


>> added the types : node in compiler in the tsconfig.json file
```bash
  "compilerOptions": 
    "types" : ["node"],
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
```


>> if still dist not worked properly
```bash
npm install -D @types/node
```



# Serve  the dist folder 
npm i -g serve
cd dist/
serve .
