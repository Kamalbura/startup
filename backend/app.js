// SkillLance Modern Architecture Entry Point
// Purpose: Start the modern server with clean architecture

import { ModernSkillLanceServer } from './src/server.js'

// Create and start the modern server
const server = new ModernSkillLanceServer()
server.start()

export default server
