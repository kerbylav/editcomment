<script type="text/javascript">
jQuery(document).ready(function($){
	ls.comments.options.edit_button_code='<button type="submit" class="button button-primary" name="submit_edit" id="comment-button-submit-edit" onclick="ls.comments.edit(\'form_comment\',{$iTargetId},\'{$sTargetType}\'); return false;">{$aLang.plugin.editcomment.edit_button_title}</button>';
	ls.comments.options.history_button_code='<button type="button" class="button" name="submit_history" id="comment-button-history" onclick="ls.comments.showHistory(); return false;">{$aLang.plugin.editcomment.history_button_title}</button>';
});
</script>

