migrate(
  (app) => {
    const collection = new Collection({
      name: 'servicos',
      type: 'base',
      listRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      createRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      updateRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && usuario_id = @request.auth.id",
      fields: [
        {
          name: 'usuario_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'cliente_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('clientes').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'tipo_servico',
          type: 'select',
          required: true,
          values: ['Unhas', 'Sobrancelha'],
          maxSelect: 1,
        },
        {
          name: 'valor',
          type: 'number',
          required: true,
        },
        {
          name: 'data_servico',
          type: 'date',
          required: true,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('servicos')
    app.delete(collection)
  },
)
