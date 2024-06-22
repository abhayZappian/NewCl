import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
// routing
import Routes from "routes";
// defaultTheme
import themes from "themes";
// project imports
import NavigationScroll from "layout/NavigationScroll";
import { MyContextProvider } from "context/MyContextProvider";
import NodeFormContext from "context/NodeFormContext";
import { SnackbarProvider } from "notistack";


// ==============================|| APP ||============================== //

// library.add(fas);

const App = () => {
  const customization = useSelector((state) => state.customization);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <MyContextProvider>
            <NodeFormContext>
              <SnackbarProvider>
                <CssBaseline />
                <NavigationScroll>
                  <Routes />
                </NavigationScroll>
            </SnackbarProvider>
            </NodeFormContext>
        </MyContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
