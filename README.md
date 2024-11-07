# pac-proxy

Map pac file as a proxy to local port

## Installation

```bash
npm install -g pac-proxy
```

## Usage

To display help

```bash
pac-proxy
```

Example

```bash
# Proxy a local pac to local default port
pac-proxy /foo/bar/pac

# Proxy a remote pac to local port 8080
pac-proxy https://foo.bar/pac --port 8080
```
