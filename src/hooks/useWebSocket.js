import { useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api')
  .replace('/api', '') + '/ws'

/**
 * Subscribe to a WebSocket topic.
 * @param {string} topic  - e.g. '/topic/kitchen'
 * @param {function} onMessage - called with parsed message body
 */
export default function useWebSocket(topic, onMessage) {
  const clientRef = useRef(null)

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(topic, (msg) => {
          try {
            const body = JSON.parse(msg.body)
            onMessage(body)
          } catch { /* ignore malformed messages */ }
        })
      },
      onStompError: (frame) => {
        console.error('WebSocket STOMP error', frame)
      },
    })
    client.activate()
    clientRef.current = client
  }, [topic, onMessage])

  useEffect(() => {
    connect()
    return () => {
      clientRef.current?.deactivate()
    }
  }, [connect])
}
