import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export function Landing() {

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Deploy your Github Repository</CardTitle>
                    <CardDescription>Enter the URL of your Github repository to deploy it</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="github-url">Github Repository</Label>
                            <Input placeholder="https://github.com/username/repo" />

                        </div>
                        <Button className="w-full" type="submit">Upload</Button>
                    </div>
                </CardContent>

            </Card>

        </main>
    )
}