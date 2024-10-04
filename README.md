# 3D Scene data provider

A project to render 3D scene from external data

## Install python programs

- Install

```
cd data-provider
pip install -r requirements.txt
```

## Data provider (http)

- Run

```
cd data-provider
python data-provider.py
```

- Tester

```
cd data-provider
python data-provider-tester.py
```

## Data provider (websocket)

- Run

```
cd data-provider
python websockete-data-provider.py
```

- Test client

Test single connection. Ther server must be running first.

```
cd data-provider
python websockete-data-provider-tester.py
```

Test auto reconnect.

```
cd data-provider
python websockete-data-provider-tester2.py
```

## License

MIT
