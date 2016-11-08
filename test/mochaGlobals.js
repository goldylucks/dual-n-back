import chai from 'chai'
import { spy, stub } from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

global.expect = chai.expect
global.spy = spy
global.stub = stub
global.dispatch = spy()
global.setTimeout = stub().returns(1)
global.setInterval = stub().returns(2)
global.clearInterval = spy()
global.clearTimeout = spy()
