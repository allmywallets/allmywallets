/**
 * Migrations can be partially generated with createPatch method from lib rfc6902
 */
const allVersions = {
  "0.0.0": { next: "0.1.0" },
  "0.1.0": { migrate: require("./config/0.1.0.migration"), next: "0.2.0" },
  "0.2.0": { migrate: require("./config/0.2.0.migration") }
}

export const migrate = (config, versions = allVersions) => {
  let from = "0.0.0"
  if (!config.application || !config.application.version) {
    from = "0.0.1"
  } else {
    from = config.application.version
  }

  if (!(from in versions)) {
    console.error(
      `Unsupported version number ${from} in configuration.\n` +
        "Please change the version number or migrate your configuration manually."
    )

    return config
  }

  let next = "next" in versions[from] ? versions[from].next : null

  while (next !== null) {
    const version = versions[next]

    if ("migrate" in version) {
      version.migrate(config)
    }

    config.application.version = next

    if ("next" in version) {
      next = version.next
    } else {
      next = null
    }
  }

  return config
}
