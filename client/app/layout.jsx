import Nav from "@components/Nav";
import Footer from "@components/Footer";
import '@styles/globals.css';

export const metadata = {
    title: "ChainVerse_314",
    description: "AI x Social"
}

const RootLayout = ({ children }) => {
    
  return (
    <html lang = "en">
        <body className='app app-background'>
        <Nav />
            {children}
        <Footer />
        </body>
    </html>
  )
}

export default RootLayout;