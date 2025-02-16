import { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const sampleQuestions = [  
  'What are the key indicators for diagnosing diabetes?',  
  'How frequently should patients undergo a physical exam based on age and risk factors?',  
  'How do I interpret abnormal results in a comprehensive blood test?',  
  'What are the common side effects of this medication, and how should they be managed?',  
  'What are the best practices for managing chronic pain in patients?',  
];


export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'How can I help you today?',
    },
  ]);

  const handleSendMessage = (message) => {
    if (message.trim()) {
      setMessages([...messages, { role: 'user', content: message }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `You asked: ${message}. Here's a sample response...` },
        ]);
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="rounded-full w-12 h-12 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => (e.currentTarget.title = 'AI Assistant')}
        onMouseLeave={(e) => (e.currentTarget.title = '')}
      >
        <Bot className="w-6 h-6" />
      </Button>
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-xl shadow-xl min-h-[600px] flex flex-col max-w-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Medical Assistant</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
                  <p>{msg.content}</p>
                </div>
              ))}
              {messages.length === 1 && (
                <div className="mt-4 space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left text-sm min-w-[350px] min-h-[55px]"
                    >
                      <p className='text-balance'>{question}</p>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="absolute bottom-0 w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('message');
                handleSendMessage(input.value);
                input.value = '';
              }}
              className="flex w-full gap-2"
            >
              <Input name="message" placeholder="Type your message..." />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

