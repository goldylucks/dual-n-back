import chai from 'chai'
import { spy, stub } from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
const { expect } = chai

global.expect = expect
global.spy = spy
global.stub = stub
global.dispatch = spy()
