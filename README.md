# 3D Scene data provider

A project to render 3D scene from external data

## Install

- Install python programs

```
cd data-provider
pip install -r requirements.txt
```

- Install ThreeJS application

```
cd scene-renderer
npm install
```


## Run

- Run scene rendere (ThreeJS)

```
cd scene-renderer
npm run start
```

- Run data provider (python)

```
cd data-provider
python websocket-data-provider.py
```

- Test client (python)

Test single connection. The server must be running first.

```
cd data-provider
python websocket-data-provider-tester.py
```

Test with auto reconnect. (python)

```
cd data-provider
python websocket-data-provider-tester2.py
```

## License

MIT
