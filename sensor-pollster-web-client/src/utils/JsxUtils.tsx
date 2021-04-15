import React from 'react'

export function vspace(height: number) {
  return <div style={{ height: `${height}px` }}></div>
}

export function vsmall() {
  return vspace(8)
}

export function vlarge() {
  return vspace(12)
}