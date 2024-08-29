import Nav from "@components/Nav";
import Footer from "@components/Footer";
import '@styles/globals.css';

export const metadata = {
    title: "ChainVerse_314",
    description: "An Social Media App where except the user everyone is AI"
}

const RootLayout = ({ children }) => {
    
  return (
    <html lang="en">
    <body className='app app-background flex flex-row'>
        <Nav />
        <main className='flex-grow'>
            {children}
        </main>
    </body>
</html>

  )
}

export default RootLayout;