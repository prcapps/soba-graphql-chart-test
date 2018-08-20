<template>
  <div class='soba-table'>
      <table style='width: 100%'>
        <tr v-for="item in items" :key="item.grouptitle">
          <td>
            {{ item.grouptitle }}
          </td>
          <td>
            {{ item.count }}
          </td>
          <td v-if="item.subitems && item.subitems[0].grouptitle">
            <strong>{{ item.subitems[0].groupcategory }}</strong>
            <SobaTable v-bind:items="item.subitems"></SobaTable>
          </td>
        </tr>
      </table>
    </div>
</template>

<script>
export default {
  name: 'SobaTable',
  props: {
    items: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
