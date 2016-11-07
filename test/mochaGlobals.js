import chai from 'chai'
import { spy } from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
const { expect } = chai

global.expect = expect
global.spy = spy
