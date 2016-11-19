import chai from 'chai'
import { spy, stub } from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

global.expect = chai.expect
global.spy = spy
global.stub = stub
