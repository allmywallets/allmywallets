/**
 * Migrations can be partially generated with createPatch method from lib rfc6902
 */
const allVersions = {
  '0.0.0': { next: '0.0.1' },
  '0.0.1': require('./config/0.0.1.migration'),
  '0.1.0': {}
}

export const migrate = (config, versions = allVersions) => {
  let from = '0.0.0'
  if (!config.application || !config.application.version) {
    from = '0.0.1'
  } else {
    from = config.application.version
  }

  if (!(from in versions)) {
    console.error(
      `Unsupported version number ${from} in configuration.\n` +
      'Please change the version number or migrate your configuration manually.'
    )

    return config
  }

  do {
    const version = versions[from]

    if ('migrate' in version) {
      version.migrate(config)
    }

    config.application.version = from

    if ('next' in version) {
      from = version.next
    } else {
      from = null
    }
  } while (from !== null)

  return config
}
