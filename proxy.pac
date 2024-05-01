function FindProxyForURL(url, host) {
  if (isInNet(myIpAddress(), "10.1.10.0", "255.255.255.0")) {
    return "PROXY 1.2.3.4:8080";
  } else {
    return "DIRECT";
  }
}
