import { Link } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export type ExternalLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export function ExternalLink(props: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...props}
      // @ts-expect-error: External URLs are not typed.
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
