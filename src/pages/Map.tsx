import React, { useRef, useCallback, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { GraphNode, GraphLink } from '../types'

const tempColor: Record<string, string> = {
  cold: '#60A5FA',
  warm: '#FBBF24',
  hot: '#EF4444',
  ambassador: '#A855F7',
}

export default function MapPage() {
  const navigate = useNavigate()
  const contacts = useStore((s) => s.contacts)
  const fgRef = useRef<any>(null)

  const graphData = useMemo(() => {
    const nodes: GraphNode[] = contacts.map((c) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      temperature: c.temperature,
      val: 3 + c.connectedTo.length * 2 + (c.publications || 0) * 0.1,
    }))

    const linksSet = new Set<string>()
    const links: GraphLink[] = []
    contacts.forEach((c) => {
      c.connectedTo.forEach((targetId) => {
        const key = [c.id, targetId].sort().join('-')
        if (!linksSet.has(key)) {
          linksSet.add(key)
          links.push({ source: c.id, target: targetId, strength: 1 })
        }
      })
    })

    return { nodes, links }
  }, [contacts])

  const handleNodeClick = useCallback(
    (node: any) => {
      navigate(`/contact/${node.id}`)
    },
    [navigate]
  )

  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const r = Math.sqrt(node.val) * 4
    const color = tempColor[node.temperature] || '#94A3B8'

    ctx.shadowBlur = 12
    ctx.shadowColor = color
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    if (globalScale > 0.8) {
      const label = String(node.name || '').split(' ')[0]
      ctx.font = `${Math.max(9, 11 / globalScale)}px Inter, sans-serif`
      ctx.fillStyle = '#E5E7EB'
      ctx.textAlign = 'center'
      ctx.fillText(label, node.x, node.y + r + 10)
    }
  }, [])

  return (
    <div className="h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-4 pb-2 bg-gradient-to-b from-gray-950 to-transparent">
        <h1 className="text-white font-bold text-lg">
          <span className="text-brand-500">NEX</span>MAP
        </h1>
        <p className="text-gray-400 text-xs">Карта влияния · {contacts.length} контактов</p>
      </div>

      <div className="absolute bottom-20 left-4 z-10 bg-gray-900 bg-opacity-80 rounded-xl p-3 border border-gray-800">
        {[
          { key: 'ambassador', label: 'Амбассадор' },
          { key: 'hot', label: 'Горячий' },
          { key: 'warm', label: 'Тёплый' },
          { key: 'cold', label: 'Холодный' },
        ].map((item) => (
          <div key={item.key} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tempColor[item.key] }} />
            <span className="text-gray-300 text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeCanvasObject={drawNode}
        nodeCanvasObjectMode={() => 'replace'}
        linkColor={() => 'rgba(148,163,184,0.25)'}
        linkWidth={1.5}
        backgroundColor="#030712"
        onNodeClick={handleNodeClick}
        cooldownTicks={80}
        d3AlphaDecay={0.02}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  )
}

