//
//  BunBridge.swift
//  PhotoBackAppMac-macOS
//
//  Created by Stefan Wallin on 2024-02-15.
//

import Foundation

@objc(BunBridge)
class BunBridge: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
    
  @objc func executeBunScript(_ script: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let task = Process()
    let bunPath = Bundle.main.path(forResource: "bun", ofType: "") // Adjust based on where you've added Bun
    task.launchPath = bunPath
    task.arguments = ["run", script] // Example arguments, adjust as needed

    let pipe = Pipe()
    task.standardOutput = pipe
    task.standardError = pipe

    task.launch()
    task.waitUntilExit()

    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    let output = String(data: data, encoding: .utf8) ?? ""

    if task.terminationStatus == 0 {
      resolver(output)
    } else {
      rejecter("BunError", "Bun execution failed with output: \(output)", NSError(domain: "BunExecutionErrorDomain", code: 1, userInfo: nil))
    }
  }
}
