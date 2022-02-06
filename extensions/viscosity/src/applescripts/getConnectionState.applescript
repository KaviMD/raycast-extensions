tell application "Viscosity"
  set conName to "Home"
  set conState to the state of connections where name is equal to conName
  set conTimeConnected to the timeConnected of connections where name is equal to conName
  set conIPv4Address to the IPv4Address of connections where name is equal to conName
  set conIPv6Address to the IPv6Address of connections where name is equal to conName
  set conServerIPv4Address to the serverIPv4Address of connections where name is equal to conName
  set conServerIPv6Address to the serverIPv6Address of connections where name is equal to conName
  set conServerAddress to the serverAddress of connections where name is equal to conName
  set stateData to {conState, conTimeConnected, conIPv4Address, conIPv6Address, conServerIPv4Address, conServerIPv6Address, conServerAddress}
  return stateData
end tell