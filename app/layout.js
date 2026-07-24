export const metadata = {
  title: 'Craton.ai Engine',
  description: 'Autonomous AI Engine',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000', color: '#10b981', fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  );
}
