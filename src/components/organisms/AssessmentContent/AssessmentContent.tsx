import React, { RefObject } from "react";
import { ScrollView, View } from "react-native";

import { Assessment } from "../../../types/assessment";
import { AssessmentTemplate } from "../../templates/AssessmentTemplate";
import { AssessmentForm } from "../AssessmentForm";

type Props = {
  assessment: Assessment;
  onUpdate: (key: string, value: string | string[]) => void;
  captureRef: RefObject<View | null>;
  isMobile: boolean;
};

export function AssessmentContent({
  assessment,
  onUpdate,
  captureRef,
  isMobile,
}: Props) {
  if (isMobile) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <View
          ref={captureRef}
          nativeID="template-capture-area"
          style={{ backgroundColor: "#0e0e0e", width: 900 }}
        >
          <AssessmentTemplate>
            <AssessmentForm assessment={assessment} onUpdate={onUpdate} />
          </AssessmentTemplate>
        </View>
      </ScrollView>
    );
  }

  return (
    <View
      ref={captureRef}
      nativeID="template-capture-area"
      style={{
        backgroundColor: "#0e0e0e",
        maxWidth: 900,
        alignSelf: "center",
        width: "100%",
      }}
    >
      <AssessmentTemplate>
        <AssessmentForm assessment={assessment} onUpdate={onUpdate} />
      </AssessmentTemplate>
    </View>
  );
}
