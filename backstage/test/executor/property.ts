import startDebugGame from '@test/base/start_game'
import { assert } from '@app/util/emergency'
import { debugScope } from '@test/base/debug_scope'
import { mPropertyId } from '@app/base/uid'
import { PropertyOp, ValueSource } from '@app/ruleset'
import { nextTurn } from '@app/executor/turn'

function testSimple() {
   const cx = startDebugGame()
   cx.pushScope(debugScope)

   cx.initPropertySimple('simple_property', '测试属性', 114)

   const property = cx.state.player.properties[mPropertyId(debugScope, 'simple_property')]
   assert(!!property)

   assert(property.value === 114)
   assert(property.min === 0)
   assert(property.max === undefined)
   assert(property.increment === undefined)
   assert(property === cx.getProperty('simple_property'))

   console.info('Test executor:property:simple OK')
}

function testHook() {
   const cx = startDebugGame()
   cx.pushScope(debugScope)

   const updateRecord: { opRef: { op: PropertyOp, value: number }, source: ValueSource }[] = []
   cx.setV(
      'update_detected_fn',
      (opRef: { op: PropertyOp, value: number }, source: ValueSource) => {
         updateRecord.push({ opRef, source })
      }
   )

   let propertyOverflown = false
   cx.setV('overflow_detected_fn', () => { propertyOverflown = true })

   let propertyUnderflown = false
   cx.setV('underflow_detected_fn', () => { propertyUnderflown = true })

   const property = cx.initProperty('simple_property', { name: '测试属性', value: 50, min: 0, max: 100 })
   cx.connect(cx.signals.propertyUpdated('simple_property'), 'property_update_detect')
   cx.connect(cx.signals.propertyOverflow('simple_property'), 'property_overflow_detect')
   cx.connect(cx.signals.propertyUnderflow('simple_property'), 'property_underflow_detect')

   cx.updateProperty('simple_property', 'add', 25, '@test')
   assert(!propertyOverflown)
   assert(!propertyUnderflown)
   assert(property.value === 75)

   cx.updateProperty('simple_property', 'sub', -25, '@test')
   assert(!propertyOverflown)
   assert(!propertyUnderflown)
   assert(property.value === 100)

   cx.updateProperty('simple_property', 'add', -25, '@test')
   assert(!propertyOverflown)
   assert(!propertyUnderflown)
   assert(property.value === 75)

   cx.updateProperty('simple_property', 'add', 50, '@test')
   assert(propertyOverflown)
   assert(!propertyUnderflown)
   assert(property.value === property.max)

   propertyOverflown = false
   cx.updateProperty('simple_property', 'set_max', 50)
   assert(propertyOverflown)
   assert(!propertyUnderflown)
   assert(property.value === property.max)

   propertyOverflown = false
   cx.updateProperty('simple_property', 'sub', 125, '@test')
   assert(!propertyOverflown)
   assert(propertyUnderflown)
   assert(property.value === property.min)

   const expectedUpdateRecord = [
      { opRef: { operator: 'add', value: 25 }, source: '@test' },
      { opRef: { operator: 'add', value: 25 }, source: '@test' },
      { opRef: { operator: 'sub', value: 25 }, source: '@test' },
      { opRef: { operator: 'add', value: 50 }, source: '@test' },
      { opRef: { operator: 'sub', value: 125 }, source: '@test' }
   ]

   assert(JSON.stringify(expectedUpdateRecord) === JSON.stringify(updateRecord))

   console.info('Test executor:property:hook OK')
}

function testIncrement() {
   const cx = startDebugGame()
   cx.pushScope(debugScope)

   const updateRecord: { opRef: { op: PropertyOp, value: number }, source: ValueSource }[] = []
   cx.setV(
      'update_detected_fn',
      (opRef: { op: PropertyOp, value: number }, source: ValueSource) => {
         updateRecord.push({ opRef, source })
      }
   )

   const property = cx.initProperty('simple_property', { name: '测试属性', value: 50, min: 0, max: 100, increment: 10 })
   cx.connect(cx.signals.propertyUpdated('simple_property'), 'property_update_detect')

   nextTurn(cx)
   assert(property.value === 60)

   nextTurn(cx)
   assert(property.value === 70)

   const expectedUpdateRecord = [
      { opRef: { operator: 'add', value: 10 }, source: '@turn_incr' },
      { opRef: { operator: 'add', value: 10 }, source: '@turn_incr' }
   ]

   assert(JSON.stringify(expectedUpdateRecord) === JSON.stringify(updateRecord))
   console.info('Test executor:property:increment OK')
}

function testProperty() {
   testSimple()
   testHook()
   testIncrement()
}

export default testProperty
