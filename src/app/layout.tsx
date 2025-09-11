import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Octoscorp',
	description: 'A NextJS portfolio website',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				{/* TODO: Required? */}
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap" />
				<meta name="theme-color" content="#000000" />
			</head>
			<body>
				<div id="root">{children}</div>
			</body>
		</html>
	)
}
