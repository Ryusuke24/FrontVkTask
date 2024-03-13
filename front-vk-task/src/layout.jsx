import { useState } from "react";
import {
  View,
  Panel,
  PanelHeader,
  Group,
  Cell,
  Avatar,
  SplitLayout,
  SplitCol,
  usePlatform,
  useAdaptivityConditionalRender,
} from "@vkontakte/vkui";
import style from "./layout.module.css";
import { FactTaskComponent } from "./components/factTask/FactTaskComponent";
import { FormTaskComponent } from "./components/formTask/FormTaskComponent";

const panels = ["Задание 1", "Задание 2"];

export const Layout = () => {
  const platform = usePlatform();
  const { viewWidth } = useAdaptivityConditionalRender();
  const [panel, setPanel] = useState(panels[0]);
  const [popout, setPopout] = useState(null);

  const isVKCOM = platform === "vkcom";

  return (
    <SplitLayout
      className={style.layout}
      style={{ justifyContent: "center" }}
      header={!isVKCOM && <PanelHeader delimiter="none" />}
      popout={popout}
    >
      {viewWidth.tabletPlus && (
        <SplitCol
          className={viewWidth.tabletPlus.className}
          fixed
          width={280}
          maxWidth={280}
        >
          <Panel className={style.panel}>
            {!isVKCOM && <PanelHeader />}
            <Group className={style.GroupPanelButton}>
              {panels.map(i => (
                <div className={style.PanelButton} onClick={() => setPanel(i)}>
                  <Cell key={i} hovered={i === panel}>
                    {i}
                  </Cell>
                </div>
              ))}
            </Group>
          </Panel>
        </SplitCol>
      )}

      <SplitCol
        className={style.panelWindow}
        width="100%"
        maxWidth="560px"
        stretchedOnMobile
        autoSpaced
      >
        <View activePanel={panel}>
          <Panel id={panels[0]}>
            <PanelHeader after={<Avatar size={36} />}>Задание 1 </PanelHeader>
            <FactTaskComponent />
          </Panel>

          <Panel id={panels[1]}>
            <PanelHeader after={<Avatar size={36} />}>Задание 2 </PanelHeader>
            <FormTaskComponent />
          </Panel>
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
