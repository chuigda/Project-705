const skillHook = skillId => ({
   hookType: 'skill',
   skillId
})

const ascensionPerkHook = ascensionPerkId => ({
   hookType: 'ap',
   ascensionPerkId
})

module.exports = {
   skillHook,
   ascensionPerkHook
}
