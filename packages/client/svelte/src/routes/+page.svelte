<script lang="ts">
  import Cute from '$lib/components/cute/index.svelte'
  import ThemeProvider from '$lib/ui/theme-wrapper'
  import { Column, Row, Button, Text } from '$lib'
  import { theme } from '@latitude-sdk/client'

  const defaultTheme = theme.skins.themes[1]
</script>

<ThemeProvider theme={defaultTheme} />

<Column>
  <Row>
    <Column>
      <Cute>
        <Button>Click me</Button>
      </Cute>
      <Cute>
        <Button>Click me</Button>
      </Cute>
    </Column>
    <Column>
      <Cute>
        <Button>Click me</Button>
      </Cute>
    </Column>
  </Row>
  <Row>
    <Column>
      <Text.H1>Heading</Text.H1>
      <Text.H4 color="gray400">Subheader</Text.H4>
    </Column>
    <Column>
      <Cute>
        <Button>Click me</Button>
      </Cute>
    </Column>
  </Row>
</Column>
