import { httpGet } from '@app/api/http'
import { parseMiniConf } from '@app/util/miniconf'

export interface ServerInfo {
   name: string
   lang?: string
   version?: string
   caps: Set<string>
}

export async function probeServer(): Promise<ServerInfo | undefined> {
   try {
      const miniConfText = await httpGet<string>(
         '/api/probe',
         undefined,
         (resp: Response) => resp.text()
      )

      const miniConf = parseMiniConf(miniConfText)
      return {
         name: miniConf['name'] ?? 'unknown',
         lang: miniConf['lang'],
         version: miniConf['version'],
         caps: new Set((miniConf['caps'] ?? '').split(',').map(s => s.trim()))
      }
   } catch (e: any) {
      return undefined
   }
}
