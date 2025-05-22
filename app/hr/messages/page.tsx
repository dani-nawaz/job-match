"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HRNav } from "@/components/hr-nav"
import { Search, Send } from "lucide-react"

// Mock conversation data
const mockConversations = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for considering my application. I'm very interested in the position.",
    timestamp: "10:30 AM",
    unread: true,
  },
  {
    id: 2,
    name: "Jamie Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I have experience with React and Node.js from my previous internship.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    name: "Taylor Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When would be a good time for an interview?",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    name: "Jordan Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've attached my portfolio as requested.",
    timestamp: "Monday",
    unread: false,
  },
]

// Mock messages for a conversation
const mockMessages = [
  {
    id: 1,
    sender: "hr",
    content: "Hi Alex, thanks for applying to the Software Engineering Intern position. Your profile looks impressive!",
    timestamp: "10:15 AM",
  },
  {
    id: 2,
    sender: "student",
    content: "Thank you for considering my application. I'm very interested in the position.",
    timestamp: "10:30 AM",
  },
  {
    id: 3,
    sender: "hr",
    content: "I'd like to schedule an interview with you. Are you available next week?",
    timestamp: "10:32 AM",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const newMsg = {
      id: messages.length + 1,
      sender: "hr",
      content: newMessage,
      timestamp: "Just now",
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 mx-auto">
          <h1 className="text-xl font-bold">JobMatch</h1>
          <HRNav />
        </div>
      </header>
      <div className="flex-1 bg-gray-50">
        <div className="container h-full px-4 py-6 mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-gray-500">Communicate with potential candidates</p>
          </div>

          <div className="grid h-[calc(100vh-200px)] grid-cols-1 overflow-hidden rounded-lg border bg-white md:grid-cols-3">
            <div className="border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search conversations"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-auto h-[calc(100vh-280px)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation.id === conversation.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                      <AvatarFallback>
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread && <div className="w-2 h-2 bg-black rounded-full"></div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col md:col-span-2">
              <div className="flex items-center gap-4 p-4 border-b">
                <Avatar>
                  <AvatarImage
                    src={selectedConversation.avatar || "/placeholder.svg"}
                    alt={selectedConversation.name}
                  />
                  <AvatarFallback>
                    {selectedConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversation.name}</h3>
                  <p className="text-xs text-gray-500">Software Engineering Intern Applicant</p>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "hr" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "hr" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === "hr" ? "text-gray-300" : "text-gray-500"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
