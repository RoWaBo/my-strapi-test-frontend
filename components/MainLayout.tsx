
interface MainLayoutProps {
    className?:string
}


const MainLayout: React.FC<MainLayoutProps> = ({ className, children }) => {
  return (
    <main className={`py-9 px-4 sm:py-15 sm:px-8 lg:max-w-7xl lg:mx-auto lg:px-8 ${className}`}>
      {children}
    </main>
  );
};

export default MainLayout;
