import startDebugGame from '@test/base/start_game'
import { debugScope } from '@test/base/debug_scope'
import { assert } from '@app/util/emergency'

function testSimple() {
   const cx = startDebugGame()
   cx.pushScope(debugScope)

   const property = cx.initProperty('property', { name: '测试属性', value: 50, min: 0, max: 100 })
   cx.addModifier('test_property_modifier')

   cx.updateProperty('property', 'add', 10, '@test')
   assert(property.value === 62)

   cx.updateProperty('property', 'add', 10)
   assert(property.value === 72)

   cx.updateProperty('property', 'sub', 10, '@test')
   assert(property.value === 60)

   cx.updateProperty('property', 'sub', 10)
   assert(property.value === 50)

   console.info('Test executor:modifier:simple OK')
}

function testComposition() {
   const cx = startDebugGame()
   cx.pushScope(debugScope)
   const property = cx.initProperty('property', { name: '测试属性', value: 100, min: 0, max: 200 })
   cx.addModifier('test_property_modifier') // all: { gain: 0.2, loss: 0.2 }
   cx.addModifier('test_property_modifier1') // @test: { gain: 0.1, loss: -0.1 }
   cx.addModifier('test_property_modifier2') // @test: { gain: 0.1, loss: -0.2 }
   cx.addModifier('test_property_modifier3') // @test2: { gain: 0.0, loss: 0.1 }

   // 总之: @test: { gain: 0.4, loss: -0.1 }
   //       @test2: { gain: 0.2, loss: 0.3 }

   cx.updateProperty('property', 'add', 10, '@test')
   assert(property.value === 114 /* 100 + 10 * 1.4 */)

   cx.updateProperty('property', 'sub', 10, '@test')
   assert(property.value === 105 /* 114 - 10 * 0.9 */)

   cx.updateProperty('property', 'add', 10, '@test2')
   assert(property.value === 117 /* 105 + 10 * 1.2 */)

   // 加上一个负值等于减去正值，会在 updateProperty 中自动转换
   cx.updateProperty('property', 'add', -10, '@test2')
   assert(property.value === 104 /* 117 - 10 * 1.3 */)

   console.info('Test executor:modifier:composition OK')
}

function testModifier() {
   testSimple()
   testComposition()
}

export default testModifier
