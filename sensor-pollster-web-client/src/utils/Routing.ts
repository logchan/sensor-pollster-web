import { useLocation } from 'react-router-dom';
import Sensor from '../models/Sensor';

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function linkDashboard() {
  return "/"
}

export function linkGraphs() {
  return "/graphs"
}

export function linkSensor(sensor: Sensor) {
  return `/sensor?address=${sensor.address}`
}