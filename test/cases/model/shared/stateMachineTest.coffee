###
describeWith = (store) ->
  describe "Tower.ModelStateMachine (Tower.Store.#{store.className()})", ->
    record        = null
    stateMachine  = null
    
    beforeEach (done) ->
      store.clean =>
        App.User.store(store)
        
        record        = new App.User(firstName: "James")
        stateMachine  = record.get('stateMachine')
        
        done()
      
    test 'new, currentState', ->
      assert.ok stateMachine instanceof Tower.ModelStateMachine, "record.get('stateMachine') instanceof Tower.ModelStateMachine"
      
      assert.equal stateMachine.get('currentState').get('name'), 'empty'
      
    describe '#goToState', ->  
      test 'empty', ->
        assert.equal record.get('isDirty'), false
        assert.equal stateMachine.getPath('currentState.isLoaded'), false
        assert.equal stateMachine.getPath('currentState.isDirty'), false
        assert.equal stateMachine.getPath('currentState.isSaving'), false
        assert.equal stateMachine.getPath('currentState.isDeleted'), false
        assert.equal stateMachine.getPath('currentState.isError'), false
        assert.equal stateMachine.getPath('currentState.isNew'), false
        assert.equal stateMachine.getPath('currentState.isValid'), true
        assert.equal stateMachine.getPath('currentState.isPending'), false
        
      test 'loading', ->
        stateMachine.goToState('loading')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loading'
        assert.equal stateMachine.getPath('currentState.isLoaded'), false
        assert.equal stateMachine.getPath('currentState.isDirty'), false
        assert.equal stateMachine.getPath('currentState.isSaving'), false
        assert.equal stateMachine.getPath('currentState.isDeleted'), false
        assert.equal stateMachine.getPath('currentState.isError'), false
        assert.equal stateMachine.getPath('currentState.isNew'), false
        assert.equal stateMachine.getPath('currentState.isValid'), true
        assert.equal stateMachine.getPath('currentState.isPending'), false
        stateMachine.goToState('loaded')
        
      test 'loaded', ->  
        stateMachine.goToState('saved')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.saved'
        assert.equal stateMachine.getPath('currentState.isLoaded'), true
        assert.equal stateMachine.getPath('currentState.isDirty'), false
        assert.equal stateMachine.getPath('currentState.isSaving'), false
        assert.equal stateMachine.getPath('currentState.isDeleted'), false
        assert.equal stateMachine.getPath('currentState.isError'), false
        assert.equal stateMachine.getPath('currentState.isNew'), false
        assert.equal stateMachine.getPath('currentState.isValid'), true
        assert.equal stateMachine.getPath('currentState.isPending'), false
        stateMachine.goToState('deleted')

      test 'deleted', ->
        stateMachine.goToState('deleted')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.deleted.committing'
        assert.equal stateMachine.getPath('currentState.isLoaded'), true, 'isLoaded'
        assert.equal stateMachine.getPath('currentState.isDirty'), true, 'isDirty'
        assert.equal stateMachine.getPath('currentState.isSaving'), false, 'isSaving'
        assert.equal stateMachine.getPath('currentState.isDeleted'), true, 'isDeleted'
        assert.equal stateMachine.getPath('currentState.isError'), false, 'isError'
        assert.equal stateMachine.getPath('currentState.isNew'), false, 'isNew'
        assert.equal stateMachine.getPath('currentState.isValid'), true, 'isValid'
        assert.equal stateMachine.getPath('currentState.isPending'), false, 'isPending'
      
    describe 'empty state', ->
      test '#loadingData', (done) ->
        stateMachine.send('loadingData')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.loading'
        done()
        
      test '#didChangeData', (done) ->
        stateMachine.send('didChangeData')
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.updated.uncommitted'
        done()
     
    describe 'loaded state', ->
      beforeEach ->
        stateMachine.goToState('saved')
        
      test 'enter', ->
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.saved'
        assert.equal stateMachine.getPath('currentState.isLoaded'), true

      test '#setProperty', ->
        stateMachine.send 'setProperty', key: 'a key', value: 'a value'
        assert.equal stateMachine.getPath('currentState.path'), 'rootState.updated.uncommitted'
        assert.equal stateMachine.getPath('currentState.dirtyType'), 'updated'
        
        assert.equal record.get('isDirty'), true
        assert.equal record.get('isLoaded'), true

      describe '#willCommit', ->
        beforeEach ->
          stateMachine.send 'setProperty', key: 'a key', value: 'a value'
          stateMachine.send 'willCommit'
          
        test 'committing', ->
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.updated.committing'

        test '#becameInvalid', ->
          assert.equal record.get('isValid'), true
          stateMachine.send 'becameInvalid', some: "error!"
          assert.equal stateMachine.getPath('currentState.path'), 'rootState.updated.invalid'
          assert.equal record.get('isValid'), false

describeWith(Tower.StoreMemory)
###