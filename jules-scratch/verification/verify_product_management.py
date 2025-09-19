from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://127.0.0.1:8080/admin")
    page.screenshot(path="jules-scratch/verification/login_page.png")
    page.get_by_placeholder("Username").fill("admin")
    page.get_by_placeholder("Password").fill("admin123")
    page.get_by_role("button", name="Sign In").click()

    # Check if login was successful
    expect(page).to_have_url("http://127.0.0.1:8080/admin/dashboard")


    # Add a new product
    page.get_by_role("button", name="Add Product").click()
    page.get_by_label("Product Name").fill("Test Product")
    page.get_by_label("Price").fill("100")
    page.get_by_label("Category").fill("Test Category")
    page.get_by_role("button", name="Add Size").click()
    page.get_by_placeholder("Size (e.g., S, M, L)").fill("M")
    page.get_by_placeholder("Price").fill("120")
    page.get_by_role("button", name="Save").click()

    # Verify the product was added
    expect(page.get_by_text("Test Product")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/add_product_verification.png")

    # Edit the product
    page.get_by_role("button", name="Edit").last.click()
    page.get_by_label("Product Name").fill("Updated Test Product")
    page.get_by_role("button", name="Save").click()

    # Verify the product was updated
    expect(page.get_by_text("Updated Test Product")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/edit_product_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
