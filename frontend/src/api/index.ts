const api = {
   closeDialog: async (dialogId: string) => {
      const r = await fetch(`/api/dialog/${dialogId}/close`, {
         method: 'POST',
         body: JSON.stringify({ dialogId  })
      })
      return await r.json()
   }
}


export default api
