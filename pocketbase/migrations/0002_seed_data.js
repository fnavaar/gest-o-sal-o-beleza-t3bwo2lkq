migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let user
    try {
      user = app.findAuthRecordByEmail('_pb_users_auth_', 'navaar@adapta.org')
    } catch (_) {
      user = new Record(users)
      user.setEmail('navaar@adapta.org')
      user.setPassword('Skip@Pass')
      user.setVerified(true)
      user.set('name', 'Admin')
      app.save(user)
    }

    const clientes = app.findCollectionByNameOrId('clientes')

    const seedClientes = [
      { nome: 'Mariana Silva', telefone: '(11) 98765-4321', eh_preferencia: true },
      { nome: 'Beatriz Oliveira', telefone: '(21) 97654-3210', eh_preferencia: false },
      { nome: 'Camila Santos', telefone: '(31) 99988-7766', eh_preferencia: true },
      { nome: 'Amanda Costa', telefone: '(41) 98877-6655', eh_preferencia: false },
    ]

    for (const c of seedClientes) {
      try {
        app.findFirstRecordByData('clientes', 'nome', c.nome)
      } catch (_) {
        const record = new Record(clientes)
        record.set('nome', c.nome)
        record.set('telefone', c.telefone)
        record.set('eh_preferencia', c.eh_preferencia)
        record.set('usuario_id', user.id)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'navaar@adapta.org')
      app.delete(user)
    } catch (_) {}
  },
)
