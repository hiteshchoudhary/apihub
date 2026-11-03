// importing required components
import Background from './component/Background';
import Content from './component/Content';

const App = () => {
  return (
    <>
    {/* using fragments to save memory */}
      <Background />
      <Content />
    </>
  )
}

export default App
