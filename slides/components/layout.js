import React from "react";
import { GeistProvider, CssBaseline } from "@geist-ui/react";
import { Fieldset, Avatar, Code, Button } from "@geist-ui/react";


export default ({ children }) => (
  <GeistProvider themeType="dark">
    <CssBaseline />
    <Fieldset style={{ width: "100%", height: "100vh" }}>
      {children}
      <Fieldset.Footer style={{ padding: "3px 32px", height: "64px" }}>
        <Fieldset.Footer.Status>
          <Code>Devhost 2021</Code>
        </Fieldset.Footer.Status>
        <Fieldset.Footer.Actions>
          <Avatar src="https://github.com/sampoder.png" />
          <span
            style={{
              height: "30px",
              display: "inline-block",
              paddingTop: "2px",
              marginLeft: "8px",
            }}
          >
            by @sampoder
          </span>
        </Fieldset.Footer.Actions>
      </Fieldset.Footer>
    </Fieldset>
    <style>{`  
    code{
      color: #FF4D4D;
    }
    
    .fieldset .content.jsx-1378117926{
      height: calc(100vh - 64px)
    }
   `}</style>
  </GeistProvider>
);
